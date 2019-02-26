<template>
  <v-app id="app-home" class="back">

        <!-- 左側選單 -->
          <v-navigation-drawer v-model="memuStatus" fixed app>

            <v-toolbar color="secondary" light>
              <v-toolbar-side-icon @click.stop="memuStatus = !memuStatus"></v-toolbar-side-icon>
              <v-spacer></v-spacer>
              <v-badge color="red" left>
                <span slot="badge">3</span>
                <v-icon  medium color="grey">mail</v-icon>
              </v-badge>
              <v-badge  color="orange">
                <span slot="badge">1</span>
                <v-icon medium color="grey darken-1">event_note</v-icon>
              </v-badge>
              <span>..</span>

            </v-toolbar>

            <!-- 病人卡 -->
            <!--<v-btn icon  @click.native="webCamClick" ><v-icon>camera_alt</v-icon></v-btn>-->
            <PatientCard1 @showWebCam="webCamClick"></PatientCard1>

            <!-- Menu 程式選單 -->
            <AppAside></AppAside>

          </v-navigation-drawer>


          <!-- 右側主功能區 -->


          <!-- Header ---->
          <AppHeader @menu_click="menuClick" v-on:PatientList_click="patientListClick" v-on:Logout="logOut"></AppHeader>
          <v-container fluid >
              <!-- Article -->
              <router-view></router-view>
          </v-container>


          <!-- 尾頁-->
          <AppFooter></AppFooter>






      <!-- PatientLits : 使用 dialog 顯示 -->
      <v-dialog v-model=patientListStatus
                max-width="1200"
                value=false
                scrollable>
        <v-card>
          <v-card-text>
            <patient-list1></patient-list1>
          </v-card-text>
          <v-card-actions>
            <!--<v-btn color="primary" flat @click.stop="patientListClick">選取</v-btn>-->
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- 我是 WebCam -->
      <v-dialog v-model=webCamStatus
                max-width="1200"
                value=false
                scrollable
                persistent >
        <v-card>
          <v-card-text>
            <web-cam :start="webCamStatus"></web-cam>
          </v-card-text>
        </v-card>
      </v-dialog>


      <!-- 我是 snackbar -->
      <v-snackbar
        :timeout="snackBar.timeout"
        v-model="snackBar.status">
        {{snackBar.text}}
        <v-btn dark flat @click.native="closeSnackBar">{{snackBar.closeText}}</v-btn>
      </v-snackbar>
  </v-app>
</template>

<script>
  import PatientCard1 from "@/components/function/inursingsys/PatientCard1"
  import AppFooter from "@/components/main/AppFooter"
  import AppHeader from "@/components/main/AppHeader"
  import AppArticle from "@/components/main/AppArticle"
  import AppAside from "@/components/main/AppAside"
  import PatientList1 from "@/components/function/inursingsys/PatientList1"
  import WebCam from "../function/inursingsys/WebCam";

  export default {
        name: "Home",
        data() {
          return {
            showSnack:false,
            memuStatus:true,
            //patientListStatus:true,
            patientInfo:{
              chartNo:'',
              ptName:'',
              bedNo:''
            }
          }
        },
        computed : {
          patientListStatus: {
            get:function(){
              return this.$store.state.SystemControl.AppHome_patientListStatus;
            },
            set:function () {
              this.$store.commit('togglePtList');
            }
          },
          snackBar:{
            get:function(){
              return this.$store.state.SystemControl.AppHome_snackbar;
            },
            set:function () {

            }
          },
          webCamStatus:{
            get:function () {
              return this.$store.state.SystemControl.AppHome_webCamStatus;
            },
            set:function () {
              this.$store.commit('toggleWebCam');
            }
          }
        },
        created() {
          console.log("AppHome created() !!");
          //this.$router.push('AppArticle');
        },
        updated() {
          console.log("AppHome updated() !!");
        },
        mounted() {
          console.log("AppHome mounded() !!");

        },
        components:{
          WebCam,
          PatientCard1,
          AppFooter,
          AppHeader,
          AppArticle,
          AppAside,
          PatientList1
        },
        methods:{
          closeSnackBar:function(){
            let snackObj = this.$store.state.SystemControl.AppHome_snackbar;
            snackObj.status = false;
            this.$store.commit('setSnackBar',snackObj);
          },
          menuClick: function(event) {
            this.memuStatus = !this.memuStatus;
          },
          patientListClick: function(event){
              this.$store.commit('togglePtList');
          },
          webCamClick: function(event){
            this.$store.commit('toggleWebCam');
          },
          logOut: function(){
            alert("Logout !!");
            //----- clear data -----
            this.$store.commit('clearPt');
            this.$store.commit('logoutProc');
            //----------------------
            this.$router.replace('/');
          }
        }
    }
</script>

<style scoped>
  .back {
    margin: -15px;
    padding: 0px;
    width: 102%;

    background-color:rgba(0, 0, 0, 0.1);
    background-size: cover;

  }
</style>
