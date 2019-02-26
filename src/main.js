// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import colors from 'vuetify/es5/util/colors'
import axios from 'axios'
import UtiltyJS from './js/UtilityFunction.js'
import FilterFunction from './js/FilterFunction.js'

//------ 載入後端位置的設定檔 --------

  import appSetting from '../static/conf/setting.json';
  console.log("appSetting baseURL= " + appSetting.baseURL);
  console.log("appSetting FormViewer_url= " + appSetting.FormViewer_url);

//----- 攔截所有透過 axios 回傳的 response --------------
  axios.interceptors.response.use(function (response) {
  //console.log(response);
    if(response.data['status'] == ""){ //response 驗證不符 導回登入頁面
      router.push('/');
    }else{
      return response;
    }
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
  });


  Vue.config.productionTip = false;

  Vue.use(Vuex);
  //Vue.use(axios)

  axios.defaults.baseURL = appSetting.baseURL;
  //前端測試請使用 '/iNursingSrv' WebService
  Vue.prototype.$http = axios;
  Vue.prototype.$UtilityJs = UtiltyJS;

  const store = new Vuex.Store({
    state:{
      loginUser:{
        empNo:'',
        empName:'',
        idNo:'',
        passwd:'',
        userRole:'',
        userDept:'',
        loginDateTime:'',
        keyId:''
      },
      patientInfo:{
        chartNo:'',
        ptName:'',
        bedNo:'',
        sex:'',
        serno:'',
        admitDays:'',
        ckinDate:'',
        age:'',
        diagnosisF:'',
        pictContent:''
      },
      SystemControl:{
        AppHome_patientListStatus:true,
        AppHome_webCamStatus:false,
        AppHome_snackbar:{
          status:false,
          text:'',
          timeout:4000,
          closeText:''
        },
        //公司
        FormViewer_url:appSetting.FormViewer_url

      },
    },
    mutations : {
      loginProc(state, user) {
        state.loginUser = user;
        state.loginUser.loginDateTime = new Date();
      },
      logoutProc(state){
        state.loginUser = '';
      },
      selectPt(state, patientObj){
        state.patientInfo = patientObj;
      },
      clearPt(state) {
        state.patientInfo = '';
      },
      togglePtList(state){
        state.SystemControl.AppHome_patientListStatus = !state.SystemControl.AppHome_patientListStatus;
      },
      disablePtList(state){
        state.SystemControl.AppHome_patientListStatus = false;
      },
      toggleWebCam(state){
        state.SystemControl.AppHome_webCamStatus = !state.SystemControl.AppHome_webCamStatus;
      },
      setSnackBar(state,obj){
        state.SystemControl.AppHome_snackbar = obj;
      },
      setPtPic(state,src){
        state.patientInfo.pictContent = src;
      }
    }
  });

  Vue.use(Vuetify, {
    theme: {
      primary: colors.deepPurple.lighten2,
      secondary: colors.deepPurple.lighten4,
      accent:colors.deepPurple.accent1,
      error:colors.red.darken3
    }
  });


  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
  });





