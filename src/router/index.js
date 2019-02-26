import Vue from 'vue'
import Router from 'vue-router'


import AppHome from '@/components/main/AppHome'
import Login from '@/components/function/public/Login'
import FormViewer from '@/components/function/inursingsys/FormViewer'
import FormViewer2 from '@/components/function/inursingsys/FormViewer2'
import AppArticle from '@/components/main/AppArticle'
import PatientList1 from '@/components/function/inursingsys/PatientList1'
import EpisodeSummary from '@/components/function/inursingsys/EpisodeSummary'
import TPRRecord from '@/components/function/inursingsys/TprRecord'
//--- for test ----
import TestComp1 from '@/components/test/HtmlTest01'
import TestComp2 from '@/components/test/HtmlTest02'
import Kobe from '@/components/Kobe'

Vue.use(Router);


//mode:'history',
//base:'/iNursingSys',
export default new Router({

  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/extLogin',
      name: 'extLogin',
      component : Login
    },
    {
      path:'/home',
      component: AppHome,
      children:[
        {name:'AppArticle', path:'', component:AppArticle},
        {name:'FormViewer', path:'formviewer', component:FormViewer},
        {name:'FormViewer2', path:'formviewer2', component:FormViewer2},
        {name:'PatientList1', path:'patientlist1', component:PatientList1},
        {name:'EpisodeSummary', path:'episodesummary', component:EpisodeSummary},
        {name:'TestComp1', path:'test1',component:TestComp1},
        {name:'TestComp2', path:'test2',component:TestComp2},
        {name:'TPRRecord', path:'tprrecord',component:TPRRecord}
      ]

    }
  ]
})
