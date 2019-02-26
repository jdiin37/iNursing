<template>
  <v-app width="100%" class="back">
    <v-layout row hidden>
      <v-flex xs2 sm2 md2 xl2 class="div-left" hidden-sm-only>

        <v-btn  dark fab top small right color="accent" @click="FormViewerStatus=true">
          <v-icon>add</v-icon>
        </v-btn>
        <b>護理表單</b>
        <v-btn  dark fab top left small color="secondary" @click="refreshList">
          <v-icon>cached</v-icon>
        </v-btn>
        <v-expansion-panel id="formPtList" expand>
          <v-expansion-panel-content v-for="(Cdate, key) in GroupDate" :key="Cdate">
            <div slot="header">{{Cdate}}</div>
            <v-card>
              <ul>
                <li v-for="item  in procFilterData(Cdate)">
                  <a v-bind:href="$store.state.SystemControl.FormViewer_url+item.formlistName+'?rawPk='+item.rawPk+'&userId='+$store.state.loginUser.empNo" target="formCont">{{item.formlistTitle}}</a>
                </li>
              </ul>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>

      <v-flex xs12 sm12 md10 xl10 height="100%" >
        <iframe id="formCont"  name="formCont"  src=""  @load="iframeLoad"></iframe>
      </v-flex>

    </v-layout>
    <v-dialog v-model="FormViewerStatus"
              max-width="1200"
              value=false
              scrollable>
      <form-viewer :propsformtype="FixFormType" @addform="addForm"></form-viewer>
    </v-dialog>
  </v-app>
</template>

<script>
  import FormViewer from '@/components/function/inursingsys/FormViewer'


  export default {
      name: "FormViewer2",
      data() {
          return {
            FormViewerStatus:false,
            PtForm:[],
            key:'',
            FixFormType:'NURSING_FORM'
          }
      },
      components:{
        FormViewer
      },
      created: function () {
        this.refreshList();
      },
      computed: {
        GroupDate: function () {
          let set = new Set();
          //let setLength = set.size();
          if (this.PtForm) {
            for (let ii=0;ii<this.PtForm.length;ii++) {
              let key = this.$UtilityJs.AD2ROC_Date(this.PtForm[ii].createDate);
              //console.log("key=" + key + " " + this.PtForm[ii].createDate);
              set.add(key);
            };
            return Array.from(set.values());
          }
        }

      },

      methods : {
        addForm: function (event) {
            this.FormViewerStatus=false;
            let formName = event.addFormCode + "_v" + event.addFormVersion + ".html";
            let href = this.$store.state.SystemControl.FormViewer_url + formName + "?formlistPk=" + event.addRawKey
                + "&chartNo=" + this.$store.state.patientInfo.chartNo + "&serNo=" + this.$store.state.patientInfo.serno + "&userId=" + this.$store.state.loginUser.empNo
                + "&formlistTitle=" + event.addTitle + "&formlistName=" + formName;
            console.log("add form href  = " + href);
            window.open(href, "formCont");
            //
        },
        procFilterData:function(filterStr){
            console.log("filterStr=" + filterStr);
            return this.PtForm.filter((fitem) => this.$UtilityJs.AD2ROC_Date(fitem.createDate) == filterStr);
        },
        refreshList:function(event) {
          //alert("refreshList : " + event);
          if (this.$store.state.patientInfo.chartNo){
            let url = "/iNursingSrv/rest/ptform/" + this.$store.state.patientInfo.chartNo + "/" + this.$store.state.patientInfo.serno;
            console.log("url=" + url);
            this.$http.get(url)
              .then(response =>{
                this.PtForm = response.data.resultSet;
                //groupData = $UtilityJs.Process_Duplicate
                console.log("get ptform : " + this.PtForm);
              })
              .catch(error =>  {
                console.log("get ptform : error : " + error)
              });
          }
        },
        iframeLoad:function(event){
          //const vm = this.$refs.iframe.contentWindow.vm;
          //console.log("iframeLoad : " + vm);
          //alert("iframe load");
          const iframe = event.target;
          window.addEventListener('message', this.handleMessage)
        },
        handleMessage (event) {
          if (event.data == "add-ok")
            this.refreshList();

        }
      }
    }
</script>

<style scoped>
  .back{
    background-color:rgba(255, 255, 255, 0.9);
    background-size: cover;
  }
  #formPtList
  {
    background:rgba(0,240,204,0.3);
  }

  #formCont
  {
    height: 90%;
    width: 100%;

    zoom: 0.6;
  }

</style>
