<template>
  <v-container
    id="grid"
    fluid
    grid-list-sm
    tag="section"
  >
    <v-layout row wrap>
      <v-flex tag="h1" class="headline">
        <v-card dark color="primary">
          <v-card-text>
            <span id="errMsg" style="color: red"></span>
            <h1>拍攝大頭貼</h1>
            <v-select
              :items="Cams"
              v-model="CamID"
              label="選擇視訊裝置"
              item-value="id"
            ></v-select>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex d-flex xs12 order-xs5>
        <v-layout row wrap>
          <v-flex>
            <v-card dark color="secondary">
              <v-card-text>
                <div class="camera">
                  <video id="video">Video stream not available.</video>
                  <button id="startbutton">擷取照片</button>
                </div>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex>
            <v-card dark color="accent">
              <v-card-text>
                <canvas id="canvas">
                </canvas>
                <div class="output">
                  <img id="photo" alt="The screen capture will appear in this box.">
                </div>
              </v-card-text>
              <v-btn @click="SaveThisPhoto">確定使用這張圖</v-btn>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-btn id="btn-stopStream" @click="closeWebCam">關閉</v-btn>

  </v-container>

</template>

<script>
    export default {
        name: "WebCam",
        props:["start"],
        data() {
          return {
            WebStream:null,
            Cams:[],
            CamID:''
          }
        },watch: {
          start:function(newdata,olddata){
            if(newdata){
              this.initCam();
            }else{
            }
          },
          CamID:function (newdata,olddata) {
            if(newdata != ""){
              this.startup(newdata);
            }
          }
      },computed : {
        patientInfo() {
          return this.$store.state.patientInfo;
        }
      },
      methods:{
        closeWebCam:function(){
          this.$store.commit('toggleWebCam');
        },
        startup:function (paraCamId) {
          var width = 160;    // We will scale the photo width to this
          var height = 0;     // This will be computed based on the input stream

          // |streaming| indicates whether or not we're currently streaming
          // video from the camera. Obviously, we start at false.

          var streaming = false;

          // The various HTML elements we need to configure or control. These
          // will be set by the startup() function.

          var video = null;
          var canvas = null;
          var photo = null;
          var startbutton = null;
          var closebutton = null;
          var errMsg = null;

          var webcamStream = null;

          video = document.getElementById('video');
          canvas = document.getElementById('canvas');
          photo = document.getElementById('photo');
          startbutton = document.getElementById('startbutton');
          closebutton = document.getElementById('btn-stopStream');
          errMsg = document.getElementById('errMsg');

          // Older browsers might not implement mediaDevices at all, so we set an empty object first
          if (navigator.mediaDevices === undefined) {
            navigator.mediaDevices = {};
          }

          // Some browsers partially implement mediaDevices. We can't just assign an object
          // with getUserMedia as it would overwrite existing properties.
          // Here, we will just add the getUserMedia property if it's missing.
          if (navigator.mediaDevices.getUserMedia === undefined) {
            navigator.mediaDevices.getUserMedia = function(constraints) {

              // First get ahold of the legacy getUserMedia, if present
              var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

              // Some browsers just don't implement it - return a rejected promise with an error
              // to keep a consistent interface
              if (!getUserMedia) {
                return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
              }

              // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
              return new Promise(function(resolve, reject) {
                getUserMedia.call(navigator, constraints, resolve, reject);
              });
            }
          }

          var constraints = {
            audio: false,
            video: {
              deviceId: {exact: paraCamId},
            }
          };

          navigator.mediaDevices.getUserMedia(constraints)
            .then(stream=> {
              // Older browsers may not have srcObject
              if ("srcObject" in video) {
                video.srcObject = stream;
              } else {
                // Avoid using this in new browsers, as it is going away.
                video.src = window.URL.createObjectURL(stream);
              }
              webcamStream = stream;
              if(!webcamStream.stop && webcamStream.getTracks) {
                webcamStream.stop = function(){
                  this.getTracks().forEach(function (track) {
                    track.stop();
                  });
                };
              }
              video.onloadedmetadata = function(e) {
                video.play();
              };
            })
            .catch(function(err) {
              errMsg.innerHTML = err;
              console.log(err.name + ": " + err.message);
            });

          video.addEventListener('canplay', function(ev){
            if (!streaming) {
              height = video.videoHeight / (video.videoWidth/width);

              // Firefox currently has a bug where the height can't be read from
              // the video, so we will make assumptions if this happens.
              if (isNaN(height)) {
                height = width / (4/3);
              }
              video.setAttribute('width', width);
              video.setAttribute('height', height);
              canvas.setAttribute('width', width);
              canvas.setAttribute('height', height);
              streaming = true;
            }
          }, false);

          function clearphoto() {
            var context = canvas.getContext('2d');
            context.fillStyle = "#AAA";
            context.fillRect(0, 0, canvas.width, canvas.height);

            var data = canvas.toDataURL('image/png');
            photo.setAttribute('src', data);
          }

          function takepicture(){
            var context = canvas.getContext('2d');
            if (width && height) {
              canvas.width = width;
              canvas.height = height;
              context.drawImage(video, 0, 0, width, height);

              //var data = canvas.toDataURL('image/png',1);
              var data = canvas.toDataURL("image/jpeg", 0.5);

              photo.setAttribute('src', data);
            } else {
              clearphoto();
            }
          }

          function stopStream(){
            //webcamStream.getVideoTracks()[0].stop();
            if(webcamStream){
              webcamStream.stop();
            }
            errMsg.innerHTML = "";
          }

          startbutton.addEventListener('click', function(ev){
            takepicture();
            ev.preventDefault();
          }, false);

          closebutton.addEventListener('click',function (ev) {
            stopStream();
            ev.preventDefault();
          },false)

          clearphoto();
        },
        SaveThisPhoto:function () {
          var img_dom = document.getElementById('photo');
          var photo = img_dom.getAttribute('src');
          //document.location.href = photo.replace("image/png", "image/octet-stream")
          //this.$emit('tempUpdateImg',photo);

          var postObj ={};
          var empNo = this.$store.state.loginUser.empNo;
          if(!empNo){
            empNo = 'ORCL';
          }

          postObj.createUser = empNo;
          postObj.pictContent = photo;
          postObj.chartNo = this.patientInfo.chartNo;

          //console.log(postObj);
          let url = "/iNursingSrv/rest/patientpict/s";
          this.$http.post(url,postObj)
            .then(response =>{
              //console.log(response.data);
              if(response.data.status == "INFO"){
                let snackObj ={
                  status:true,
                  text:response.data.message,
                  timeout:4000,
                  closeText:''
                };
                this.$store.commit('setSnackBar',snackObj);
                this.$store.commit('setPtPic',photo);
              }else{
                let snackObj ={
                  status:true,
                  text:response.data.message,
                  timeout:4000,
                  closeText:''
                };
                this.$store.commit('setSnackBar',snackObj);
              }
            })
            .catch(error =>  {
              console.log("SaveThisPhoto: error : " + error);
              try {
                let snackObj ={
                  status:true,
                  text:error.response.data.message,
                  timeout:4000,
                  closeText:''
                };
                this.$store.commit('setSnackBar',snackObj);
              } catch(err) {
                let snackObj ={
                  status:true,
                  text:error.toString(),
                  timeout:4000,
                  closeText:''
                };
                this.$store.commit('setSnackBar',snackObj);
              }
            });
          // var a = document.createElement('a');
          // a.href = photo;
          // a.download = "output.png";
          // document.body.appendChild(a);
          // a.click();
          // document.body.removeChild(a);
          //
          // console.log(photo);
        },
        initCam:function () {
          this.Cams=[];
          this.CamID='';
          navigator.mediaDevices.enumerateDevices()
            .then(deviceInfos=>{
              for (var i = 0; i !== deviceInfos.length; ++i) {
                var deviceInfo = deviceInfos[i];
                var option = document.createElement('option');
                option.value = deviceInfo.deviceId;
                if (deviceInfo.kind === 'audioinput') { //聲音輸入裝置
                } else if (deviceInfo.kind === 'audiooutput') { //聲音輸出裝置
                } else if (deviceInfo.kind === 'videoinput') { //視訊裝置
                  this.Cams.push({id:deviceInfo.deviceId,text:deviceInfo.label});
                }
              }

              if(this.Cams.length > 0){   //預設第一個裝置
                this.CamID=this.Cams[0].id;
                this.startup(this.Cams[0].id);
              }

              //console.log(this.Cams);
            })
            .catch(error =>  {
              console.log("initCam error:" + error)
            });
        }
      }
    }
</script>

<style scoped>
  #video {
    border: 1px solid black;
    box-shadow: 2px 2px 3px black;
    width:320px;
    height:240px;
  }

  #photo {
    border: 1px solid black;
    box-shadow: 2px 2px 3px black;
    width:320px;
    height:240px;
  }

  #canvas {
    display:none;
  }

  .camera {
    width: 340px;
    display:inline-block;
  }

  .output {
    width: 340px;
    display:inline-block;
  }

  #startbutton {
    display:block;
    position:relative;
    margin-left:auto;
    margin-right:auto;
    bottom:32px;
    background-color: rgba(0, 150, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.7);
    box-shadow: 0px 0px 1px 2px rgba(0, 0, 0, 0.2);
    font-size: 14px;
    font-family: "Lucida Grande", "Arial", sans-serif;
    color: rgba(255, 255, 255, 1.0);
  }

  .contentarea {
    font-size: 16px;
    font-family: "Lucida Grande", "Arial", sans-serif;
  }
</style>
