<template>
  <v-app id="login">

        <v-layout align-center justify-center class="back">
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>護理資訊系統</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip right>
                  <v-btn
                    slot="activator"
                    :href="source"
                    icon
                    large
                    target="_blank"
                  >
                    <v-icon large>code</v-icon>
                  </v-btn>
                  <span>版本資訊 V1.1.1 <br> Service IP : {{ this.$http.defaults.baseURL}}</span>
                </v-tooltip>

              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field prepend-icon="person" v-model="userId" name="login" label="使用者代號" type="text" @keyup.enter="NextItem" ></v-text-field>
                  <v-text-field id="password" prepend-icon="lock" v-model="password" name="password" label="密碼" type="password"
                  @keyup.enter="Logining"></v-text-field>

                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer>請輸入使用者帳號與密碼 !!</v-spacer>
                <v-btn color="primary" @click="Logining" >登入</v-btn>
              </v-card-actions>
              <v-progress-linear :indeterminate="processStatus"></v-progress-linear>
            </v-card>

            <v-alert :value="showMessage" type="error">
              {{message}}
            </v-alert>
          </v-flex>
        </v-layout>



  </v-app>
</template>

<script>

    export default {
        name: "Login",
        data(){
          return {
            showMessage:false,
            message:'',
            source:'',
            userId:'',
            password:'',
            loginUser:[],
            processStatus:false
          }
        },

        mounted: function() {
          //----- for 直接call --------
          //http://localhost:8085/#/extLogin?uid=ORCL&upasswd=ORCL
          if (this.$route.query.uid){
            console.log("extLogin uid = " + this.$route.query.uid);
            this.userId = this.$route.query.uid;
            this.password = this.$route.query.upasswd;
            this.Logining();
          }

        },
        methods:{
          Logining: function () {
            this.showMessage = false;
            this.processStatus = true;
            let url = "/iFormSys/rest/login/" + this.userId + "/" + this.password;
            this.$http.get(url)
              .then(response =>{
                this.loginUser = response.data.resultSet;
                console.log("Login : " + this.loginUser[0].empName);
                //-------- Vuex-------------
                this.$store.commit('loginProc', this.loginUser[0]);
                //--------------------------
                this.processStatus = false;
                //this.$router.replace('home');

                if (!this.$route.query.chartno) {
                  //--- 導向選擇病人頁 ------
                  this.$router.push('home');
                } else {
                  //--- 導向己選擇病人之後頁 ------
                  //http://localhost:8085/#/extLogin?uid=ORCL&upasswd=ORCL&chartno=17669&serno=1540448
                  console.log("extLogin chartno = " + this.$route.query.chartno + this.$route.query.serno);
                  this.DirectSelectPt();
                }
              })
              .catch(error =>  {
                console.log("Login: error : " + error);
                this.processStatus = false;
                try {
                  this.message = error.response.data.message;

                } catch(err) {
                  this.message = error.toString();
                }
                this.showMessage = true;
              });

          },
          NextItem:function() {
            document.getElementById("password").focus();
          },
          DirectSelectPt:function() {
            let url = "/iNursingSrv/rest/patinp/" + this.$route.query.chartno + "/" + this.$route.query.serno;
            this.$http.get(url)
              .then(response =>{

                let selectPtObj = {
                  chartNo : response.data.resultSet[0].chartNo,
                  ptName : response.data.resultSet[0].ptName,
                  bedNo : response.data.resultSet[0].bedNo,
                  sex :response.data.resultSet[0].sex,
                  ckinDate : response.data.resultSet[0].ckinDate,
                  admitDays : '',
                  age:response.data.resultSet[0].age,
                  diagnosisF:response.data.resultSet[0].diagnosisF,
                  serno : response.data.resultSet[0].serno
                };
                //console.log("selectPtObj " + selectPtObj.age);
                this.$store.commit('selectPt', selectPtObj);
                //this.$store.commit('togglePtList');
                this.$store.commit('disablePtList');
                this.$router.push('/home/episodesummary');

              })
              .catch(error =>  {
                console.log("DirectSelectPt : error : " + error);
                //--- 導向選擇病人頁 ------
                this.$router.push('home');
              });
          }
        }

    }
</script>

<style scoped>
  .back {
    background-color:rgba(0, 0, 0, 0.1);
    background-size: cover;
  }
</style>
