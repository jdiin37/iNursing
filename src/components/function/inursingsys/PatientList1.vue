<template>
  <div class="back">
    <v-tabs icons-and-text centered dark color="primary" grow>
      <v-tabs-slider color="yellow"></v-tabs-slider>

      <v-tab href="#tab-1" @click="getMyPats">
        我的照護病人
        <v-icon>favorite</v-icon>
      </v-tab>

      <v-tab href="#tab-2">
        住院患者清單
        <v-icon>face</v-icon>
      </v-tab>
      <v-tab-item id="tab-1">
        <my-patient-list :myPats="this.myPats" :myPatsLoading="this.loading"></my-patient-list>
      </v-tab-item>
      <v-tab-item id="tab-2">
        <inp-patient-list :myPats="this.myPats"></inp-patient-list>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
    import MyPatientList from "@/components/function/inursingsys/MyPatientList1"
    import InpPatientList from "@/components/function/inursingsys/InpPatientList1"

    export default {
        name: "PatientList1",
        data() {
          return {
            loading:false,
            myPats:[

            ]
          }
        },
        components:{
          MyPatientList,
          InpPatientList
        }
      ,mounted:function(){
          this.getMyPats();
        },methods:{
          getMyPats(){
            var empNo = this.$store.state.loginUser.empNo;
            if(!empNo){
              empNo = 'ORCL';
            }
            let url = "iNursingSrv/rest/mypatientlist/byempno/" + empNo ;
            this.loading = true;
            this.$http.get(url)
              .then(response =>{
                //console.log(response.data.resultSet);
                if(response.data.resultSet){
                  this.myPats = response.data.resultSet;
                  this.myPats.forEach(function (patObj) {  //合併醫師代碼 跟 醫師姓名
                    var vs = patObj['vs'];
                    var vsName = patObj['vsName'];
                    patObj.vs = vs + ' ' + vsName;
                  });
                }
                this.loading = false;
              })
              .catch(error =>  {
                this.loading = false;
                console.log("getMyPat: error : " + error);
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
          }


        }

    }
</script>

<style scoped>
  .back {
    width: 100%;
    background-color:rgba(0, 0, 0, 0.1);
    background-size: cover;
  }
</style>
