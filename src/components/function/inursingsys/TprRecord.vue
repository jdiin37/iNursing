<template>
  <v-flex>
    <v-tabs icons-and-text centered dark color="primary" grow>
      <v-tabs-slider color="yellow"></v-tabs-slider>
      <v-tab href="#VsTab-1">
        TPR明細
        <!--<v-icon></v-icon>-->
      </v-tab>
      <v-tab href="#VsTab-2" v-show="showTab2"> <!--隱藏-->
        TPR趨勢圖
        <!--<v-icon></v-icon>-->
      </v-tab>
      <v-tab href="#VsTab-3" @click="axios_getTprChartData" > <!---->
        TPR趨勢圖
        <!--<v-icon></v-icon>-->
      </v-tab>

      <v-tab-item  id="VsTab-1">
        <v-card flat>
          <v-card-text id="TprTableContent">
            <!--TPR 明細清單-->
            <tpr-record-list ></tpr-record-list> <!--:getTprData="axios_getTprChartData" -->
          </v-card-text>
        </v-card>

      </v-tab-item>
      <v-tab-item  id="VsTab-2">
        <v-card flat>
          <v-card-text id="TprContent">
              <v-select
                v-if="tprChartNo!=''&&TPRChartList!=null"
                :items="TPRCharts"
                v-model="selectChartValue"
                label="趨勢圖"
                item-value="value"
              ></v-select>
              <!--<span> {{ selectChartValue}} 分析圖</span>-->
            <div  id="lineChartParent" class="chart-container"> <!--chart-container"-->
              <vue-line-chart  :height="chartHeight"  :chart-data="chartData" :options="options"></vue-line-chart>
            </div>
          </v-card-text>
        </v-card>
      </v-tab-item>
          <!--測試用 checkBox-->
      <v-tab-item  id="VsTab-3">
        <v-card flat>
          <v-card-text id="TprContent2">
            <v-select
              v-if="tprChartNo!=''&&TPRChartList!=null"
              v-model="tprChecked"
              :items="TPRChartsItems"
              chips
              label="趨勢圖"
              multiple
              autoComplete
            ></v-select>
            <!--<span>{{tprChecked}}</span>-->
            <div  id="lineChartParent2" class="chart-container">
              <vue-line-chart  :height="chartHeight"  :chart-data="tprChartData" :options="tprOptions"></vue-line-chart>
            </div>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-flex>
</template>

<script>
  import TprRecordList from "@/components/function/inursingsys/TprRecordList"
  import VueLineChart from  "@/components/function/inursingsys/VueLineChart.js"
  import * as CommonJs from '../../../js/common.js'

  export default {
        name: "TPRRecord",
      components:{
        TprRecordList,
        VueLineChart,
      },
    data (){
      return{
        tprChartNo:912473,
        tprSerno:107689,
        chartHeight:200,
        chartWidth:200,
        xLabels:null, //x軸 日期
        TPRChartList:[],
        // select 多選參數 ↓
        tprChartData:null,
        tprOptions:null,
        tprChecked:[],
        TPRChartsItems:[
          { text: '體溫' ,value:'temperature'},
          { text: '脈搏' ,value:'pulse'},
          { text: '呼吸' ,value:'respiration'},
          { text: '收縮壓' ,value:'systolicPressure'},
          { text: '舒張壓' ,value:'diastolicPressure'},
          { text: '體重' ,value:'weight'},
          { text: '注射量' ,value:'ivFluids'},
          { text: '飲食量' ,value:'diet'},
          { text: '輸血量' ,value:'bleed'},
          { text: '小便量' ,value:'urine'},
          { text: '引流量' ,value:'drainage'},
        ],
        TObj:null,
        PObj:null,
        RObj:null,
        SpObj:null,
        DpObj:null,
        WeightObj:null,
        IvFObj:null,
        DietObj:null,
        BleedObj:null,
        UrineObj:null,
        DrainageObj:null,
        //select 多選 參數↑
        // select 單選 參數↓
        chartData:null,
        options:null,
        tprObj:null,
        tObj:null,
        pObj:null,
        rObj:null,
        bpObj:null,
        weightObj:null,
        ioObj:null,
        TPRCharts:[
          { text: 'TPR (體溫 脈搏 呼吸)',value:'TPR' },
          { text: 'T (體溫)' ,value:'T'},
          { text: 'P (脈搏)' ,value:'P'},
          { text: 'R (呼吸)' ,value:'R'},
          { text: 'BP (收縮壓/舒張壓)' ,value:'BP'},
          { text: 'Weight (體重)' ,value:'Weight'},
          // { text: 'IO (注射量、輸血量、小便量)' ,value:'IO'}
          { text: 'IO (注射量、飲食量、輸血量、小便量、引流量)' ,value:'IO'},
        ],
        minSteps: [5,34,40,5,10,30,0],
        maxSteps: [180,42,180,80,300,200,5000],
        stepSizes: [20,1,20,10,20,10,500],
        selectChartValue:'TPR',
        showDataLabels:true,
        showTab2:false
      }
    },
      created() {
        // console.log("TPR created() !!");
      },
      updated() {
        // console.log("TPR updated() !!");
      },
      mounted() {
        this.axios_getTprChartData(); //接Api 正式資料
          // console.log('TPR mounted');
        window.onresize = function(event) {
          var userHeight = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;
          var userWidth = window.innerWidth|| document.documentElement.clientWidth|| document.body.clientWidth;
          var canvas = document.getElementById("line-chart");
          var TprContent = document.getElementById('TprContent');
          var TprTableContent = document.getElementById('TprTableContent');
          if(canvas){
            var height = userHeight-(64+72+36+10+40)
            TprContent.style.height = (height+100) + 'px';
            TprTableContent.style.height = (height+60) + 'px';
            this.chartHeight = height;
            this.chartWidth = userWidth -50;
          }

        };
      },
      computed:{
        patientInfo() { //取得共同參數 main.js 裡定義的 ()
          return this.$store.state.patientInfo;
        },
      },
      watch:{
          'selectChartValue':function (val) {  //監聽頁籤2 select 單選
            switch (val){
              case 'TPR':
                this.fillData(this.xLabels,this.tprObj,this.minSteps[0],this.maxSteps[0],this.stepSizes[0]);
                break;
              case 'T':
                this.fillData(this.xLabels,this.tObj,this.minSteps[1],this.maxSteps[1],this.stepSizes[1]);
                break;
              case 'P':
                this.fillData(this.xLabels,this.pObj,this.minSteps[2],this.maxSteps[2],this.stepSizes[2]);
                break;
              case 'R':
                this.fillData(this.xLabels,this.rObj,this.minSteps[3],this.maxSteps[3],this.stepSizes[3]);
                break;
              case 'BP':
                this.fillData(this.xLabels,this.bpObj,this.minSteps[4],this.maxSteps[4],this.stepSizes[4]);
                break;
              case 'Weight':
                this.fillData(this.xLabels,this.weightObj,this.minSteps[5],this.maxSteps[5],this.stepSizes[5]);
                break;
              case 'IO':
                this.fillData(this.xLabels,this.ioObj,this.minSteps[6],this.maxSteps[6],this.stepSizes[6]);
                break;
              default:
            }
          },
        'tprChecked':function (val) {  //監聽頁籤3 select multiple
          var datasets = [];
          var checkItem=[];
          if(val.length>0){ //使用者勾選項目
            var inputField = ["bleed", "diastolicPressure", "diet", "drainage", "ivFluids", "pulse", "respiration", "systolicPressure", "temperature", "urine", "weight"];
            var allObj = [this.BleedObj,this.DpObj,this.DietObj,this.DrainageObj,this.IvFObj,this.PObj,this.RObj,this.SpObj,this.TObj,this.UrineObj,this.WeightObj];
            for (var i=0;i<val.length;i++){
              var checkIndex = inputField.findIndex(item => item === val[i]);
              checkItem.push(checkIndex);
              datasets.push(allObj[checkIndex]);
            }

            this.fillTprChartData(this.xLabels,datasets);
            // console.log(datasets);
          }else {
            var datasets = [];
            var checkItem=[];
            this.fillTprChartData(this.xLabels,datasets);
          }

        }
      },
      methods:{
        initChartData:function(){  //初始化 chartData
          this.TPRChartList=[];
          this.xLabels = [];
            this.TObj={};
            this.PObj={};
            this.RObj={};
            this.SpObj= {};
            this.DpObj = {};
            this.WeightObj={};
            this.IvFObj={};
            this.DietObj={};
            this.BleedObj={};
            this.UrineObj = {};
            this.DrainageObj={};
        },
        axios_getTprChartData: function () { //取得TPR 曲線圖資料
          this.initChartData();
          this.tprChartNo = this.patientInfo.chartNo;
          this.tprSerno = this.patientInfo.serno;
          // console.log('axios_getTprChartData in');
          if(this.tprChartNo==''||this.tprSerno==''){
            let snackObj ={
              status:true,
              text:'尚未選擇病患',
              timeout:4000,
              closeText:''
            };
            this.$store.commit('setSnackBar',snackObj);
          }else {
            let url = "/iNursingSrv/rest/tprrecordchart/bychartnoserno/" + this.tprChartNo + "/" + this.tprSerno
            this.$http.get(url)
              .then(response =>{
                this.TPRChartList = response.data.resultSet;
                // this.setChartData(this.TPRChartList); //設定chartData 頁籤2 先隱藏
                this.setChartObjData(this.TPRChartList); //設定測試用 chartData 頁籤3 多選

                var userHeight = window.innerHeight
                  || document.documentElement.clientHeight
                  || document.body.clientHeight;
                var userWidth = window.innerWidth|| document.documentElement.clientWidth|| document.body.clientWidth;
                var TprContent = document.getElementById('TprContent');
                var canvas = document.getElementById("line-chart");
                var TprTableContent = document.getElementById('TprTableContent');

                var height = userHeight-(64+72+36+10+40)
                this.chartHeight = height;
                this.chartWidth = userWidth -50;

                if(canvas){
                  TprContent.style.height = (height+100) + 'px';
                  TprTableContent.style.height = (height+60) + 'px';
                  // canvas.setAttribute('style','height:'+this.chartHeight+'px;width:'+(userWidth-50)+'px');
                  // canvas.setAttribute('style','height:'+this.chartHeight+'px;width:'+userWidth+'px');
                }
              })
              .catch(error =>  {
                try {
                  console.log(error.response.data.message);
                } catch(err) {

                }
              });
          }

        },
        getXLabelDate(tprChartList){ //取得 X軸日期 Labels
          return CommonJs.renderRecordDateColName(tprChartList);
        },
        setChartObjData:function(tprChartList){ //頁籤3 select 多選
          this.xLabels = this.getXLabelDate(tprChartList);
          //data Array
          var tArray = [];
          var pArray = [];
          var rArray = [];
          var spArray =[];
          var dpArray = [];
          var weightArray = [];
          var ifArray = [];//注射量
          var bleedArray = [];//輸血量
          var urineArray = [];//Urine
          var dietArray = [];//飲食量
          var drainageArray = [];//引流量

          for(var i=0;i<tprChartList.length;i++){
            tArray.push(tprChartList[i].temperature==0?null:tprChartList[i].temperature);
            pArray.push(tprChartList[i].pulse==0?null:tprChartList[i].pulse);
            rArray.push(tprChartList[i].respiration==0?null:tprChartList[i].respiration);

            spArray.push(tprChartList[i].systolicPressure==0?null:tprChartList[i].systolicPressure);//收縮壓
            dpArray.push(tprChartList[i].diastolicPressure==0?null:tprChartList[i].diastolicPressure);//舒張壓
            weightArray.push(tprChartList[i].weight==0?null:tprChartList[i].weight);//體重

            ifArray.push(tprChartList[i].ivFluids);//注射量
            bleedArray.push(tprChartList[i].bleed);//輸血量
            urineArray.push(tprChartList[i].urine);//Urine
            dietArray.push(tprChartList[i].diet); //飲食量
            drainageArray.push(tprChartList[i].drainage);//引流

          }
          //Label
          var tLabel = "體溫";
          var pLabel = "脈搏";
          var rLabel = "呼吸";
          var spLabel = "收縮壓";
          var dpLable = "舒張壓";
          var weightLabel = "體重";
          var ivFLabel = '注射量';
          var dietLabel = '飲食量';
          var bleedLabel = '輸血量';
          var urineLabel = '小便量';
          var drainageLabel = '引流量';

          //Color
          var tColor = "#2259CA";
          var pColor = "#F13967";
          var rColor = "#292929";
          var spColor = "#088DBA";
          var dpColor = "#139B53";
          var weightColor = "#442978";
          var ivFColor = "#868686";
          var dietColor = "#FFCE43";
          var bleedColor = "#FF1705";
          var urineColor = '#F15A24';
          var drainageColor = '#A8C023';


          //T
          var tObj = new CommonJs.datasets(tLabel,tArray,tColor);
          //P
          var pObj = new CommonJs.datasets(pLabel,pArray,pColor);
          //R
          var rObj = new CommonJs.datasets(rLabel,rArray,rColor);
          //SP
          var spObj = new CommonJs.datasets(spLabel,spArray,spColor);
          //DP
          var dpObj = new CommonJs.datasets(dpLable,dpArray,dpColor);
          //Weight
          var weightObj = new CommonJs.datasets(weightLabel,weightArray,weightColor);
          //注射量
          var ivFObj = new CommonJs.datasets(ivFLabel,ifArray,ivFColor);
          //飲食量
          var dietObj = new CommonJs.datasets(dietLabel,dietArray,dietColor);
          //輸血量
          var bleedObj = new CommonJs.datasets(bleedLabel,bleedArray,bleedColor);
          //小便量
          var urineObj = new CommonJs.datasets(urineLabel,urineArray,urineColor);
          //引流量
          var drainageObj = new CommonJs.datasets(drainageLabel,drainageArray,drainageColor);

          this.TObj = tObj;
          this.PObj = pObj;
          this.RObj = rObj;
          this.SpObj = spObj;
          this.DpObj = dpObj;
          this.WeightObj = weightObj;
          this.IvFObj = ivFObj;
          this.DietObj = dietObj;
          this.BleedObj = bleedObj;
          this.UrineObj = urineObj;
          this.DrainageObj = drainageObj;

        },
        fillTprChartData(labels,datasets){ //頁籤3 設定塞入Tpr曲線圖資料
          this.tprChartData = {

            scaleShowGridLines : true,
            maintainAspectRatio: false,
            datasetStroke : true,
            showDatasetLabels : true,
            animation:true,
            animationSteps:200,
            // The type of chart we want to create
            type: 'line',
            responsive: true,
            pointDot: true,
            pointDotRadius: 12,
            pointDotStrokeWidth: 16,
            labels: labels,
            datasets:datasets
          };
          this.tprOptions = {
            plugins: {
              datalabels: {
                align	: 'top',
                anchor : 'bottom',
                display: true, //隱藏,顯示 線 上的 dataLable數值
                font: {
                  weight: 'bold',
                  size: 16,
                },

              },
            },
            spanGaps: true,//不斷線 1070411
            elements:{
              line:{
                tension:0,
                fill: false,
                pointStyle: 'circle',
              }
            },
            tooltips:{
              mode:'point',
              borderWidth:100,
              titleFontSize:16,
              titleSpacing:10,
              backgroundColor:'black',
              titleFontColor:'#fff',
              bodyFontSize:16,
              bodySpacing:2
            },
            title:{
              display:false,
              text:"檢驗趨勢圖",
              position:'top',
              fontSize: 20,
            },
            layout:{
              padding:{
                left:10,
                right:10,
                top:10,
                bottom:10
              }
            },
            scales: {
              xAxes: [{
                display: true,
                scaleLabel: {
                  display: true,
                  fontSize: 16,
                }
              }],
              yAxes: [{
                display: true,
                // stacked: true, //PS. 如果使用線標示的數據會錯誤
                beginAtZero:true,
                ticks: {
                  beginAtZero: false,
                },
              }]
            },
//						          plotOptions: { series: { connectNulls: true } }, //1070411 add 預防斷線
            legend:{
              position:'top',
              padding:{
                left:15,
                right:10,
                top:10,
                bottom:10
              },
              labels:{
                boxWidth:15,
//							       fontColor:'black',
                fontSize: 18,
                //fontColor:'rbg(60,180,100)'
              }

            }
          }

        },
        setChartData:function(tprChartList){ //設定ChartData 頁籤2
          this.xLabels = this.getXLabelDate(tprChartList);
          var tArray = [];
          var pArray = [];
          var rArray = [];
          var tprArray=[];

          var spArray =[];
          var dpArray = [];
          var BPAllArray = [];

          var weightArray = [];

          var ifArray = [];//注射量
          var bleedArray = [];//輸血量
          var urineArray = [];//Urine
          //Fang 新增  飲食量 引流
          var dietArray = [];//飲食量
          var drainageArray = [];//引流量
          var IOAllArray = [];//IO 全

          for(var i=0;i<tprChartList.length;i++){
            tArray.push(tprChartList[i].temperature==0?null:tprChartList[i].temperature);
            pArray.push(tprChartList[i].pulse==0?null:tprChartList[i].pulse);
            rArray.push(tprChartList[i].respiration==0?null:tprChartList[i].respiration);

            spArray.push(tprChartList[i].systolicPressure==0?null:tprChartList[i].systolicPressure);//收縮壓
            dpArray.push(tprChartList[i].diastolicPressure==0?null:tprChartList[i].diastolicPressure);//舒張壓
            weightArray.push(tprChartList[i].weight==0?null:tprChartList[i].weight);//體重

            ifArray.push(tprChartList[i].ivFluids);//注射量
            bleedArray.push(tprChartList[i].bleed);//輸血量
            urineArray.push(tprChartList[i].urine);//Urine
            dietArray.push(tprChartList[i].diet); //飲食量
            drainageArray.push(tprChartList[i].drainage);//引流

          }

          //TPR
          var dataT = new CommonJs.dataLabel(tArray);
          var dataP = new CommonJs.dataLabel(pArray);
          var dataR = new CommonJs.dataLabel(rArray);
          tprArray.push(dataT);
          tprArray.push(dataP);
          tprArray.push(dataR);

          //BP 血壓
          var dataSP = new CommonJs.dataLabel(spArray);
          var dataDP = new CommonJs.dataLabel(dpArray);
          BPAllArray.push(dataSP);
          BPAllArray.push(dataDP);

          //IO
          var dataIf = new CommonJs.dataLabel(ifArray);
          var dataBleed = new CommonJs.dataLabel(bleedArray);
          var dataUrine = new CommonJs.dataLabel(urineArray);
          var dataDiet = new CommonJs.dataLabel(dietArray);
          var dataDrainage = new CommonJs.dataLabel(drainageArray);
          IOAllArray.push(dataIf);
          IOAllArray.push(dataDiet);
          IOAllArray.push(dataBleed);
          IOAllArray.push(dataUrine);
          IOAllArray.push(dataDrainage);

          var tprLabel = ["體溫","脈搏","呼吸"];
          var tLabel = "體溫";
          var pLabel = "脈搏";
          var rLabel = "呼吸";
          var bpLabel = ["收縮壓","舒張壓"];
          var weightLabel = "體重";
          var ioLabel = ["注射量","飲食量","輸血量",'小便量','引流量'];

          var tprColor = ["#2259CA","#F13967","#292929"];
          var tColor = "#2259CA";
          var pColor = "#F13967";
          var rColor = "#292929";
          var bpColor = ["#088DBA","#139B53"];
          var weightColor = "#442978";
          var ioColor = ["#868686","#FFCE43","#FF1705",'#F15A24','#A8C023'];

          var arrayListOBJ=[];//TPR
          var tArrayObj = [];//T
          var pArrayObj = [];//P
          var rArrayObj = [];//R
          var bpArrayObj = [];//BP
          var weightArrayObj = [];//Weight
          var ioArrayObj = [];//IO

          // TPR
          for(var k=0;k<tprArray.length;k++){
            var emp = new CommonJs.datasets(tprLabel[k],tprArray[k].dataLabel,tprColor[k]);
            arrayListOBJ.push(emp);
          }

          //T
          var tObj = new CommonJs.datasets(tLabel,tArray,tColor);
          tArrayObj.push(tObj);

          //P
          var pObj = new CommonJs.datasets(pLabel,pArray,pColor);
          pArrayObj.push(pObj);

          //R
          var rObj = new CommonJs.datasets(rLabel,rArray,rColor);
          rArrayObj.push(rObj);

          //BP
          for(var k=0;k<BPAllArray.length;k++){
            var bpObj = new CommonJs.datasets(bpLabel[k],BPAllArray[k].dataLabel,bpColor[k]);
            bpArrayObj.push(bpObj);
          }

          //Weight
          var weightObj = new CommonJs.datasets(weightLabel,weightArray,weightColor);
          weightArrayObj.push(weightObj);

          //IO
          for(var k=0;k<IOAllArray.length;k++){
            var ioObj = new CommonJs.datasets(ioLabel[k],IOAllArray[k].dataLabel,ioColor[k]);
            ioArrayObj.push(ioObj);
          }

          this.tprObj = arrayListOBJ;
          this.tObj = tArrayObj;
          this.pObj = pArrayObj;
          this.rObj = rArrayObj;
          this.bpObj = bpArrayObj;
          this.weightObj = weightArrayObj;
          this.ioObj = ioArrayObj;
          //預設顯示 TPR趨勢圖
          this.fillData(this.xLabels,this.tprObj,this.minSteps[0],this.maxSteps[0],this.stepSizes[0]);

        },
        fillData(labels,datasets,minSteps,maxSteps,stepSizes){ //頁籤2
          this.chartData = {
            // scaleLineColor : '#686665',
            // scaleGridLineColor : "#686665",
            maintainAspectRatio: false,
            datasetStroke : true,
            showDatasetLabels : true,
				    animation:true,
            animationSteps:200,
            // The type of chart we want to create
            type: 'line',
            // responsive: true,
            pointDot: true,
            pointDotRadius: 12,
            pointDotStrokeWidth: 16,
            labels: labels,
            datasets:datasets
          };
          this.options = {
            plugins: {
              datalabels: {
                align	: 'top',
                anchor : 'bottom',
                display: true, //隱藏,顯示 線 上的 dataLable數值
                font: {
                  weight: 'bold',
                  size: 16,
                },

              },
            },
            spanGaps: true,//不斷線 1070411
            elements:{
              line:{
                tension:0,
                fill: false,
                pointStyle: 'circle',
              }
            },
            tooltips:{
              mode:'point',
              borderWidth:100,
              titleFontSize:16,
              titleSpacing:10,
              backgroundColor:'black',
              titleFontColor:'#fff',
              bodyFontSize:16,
              bodySpacing:2
            },
            title:{
              display:false,
              text:"檢驗趨勢圖",
              position:'top',
              fontSize: 20,
            },
            layout:{
              padding:{
                left:10,
                right:10,
                top:10,
                bottom:10
              }
            },
            scales: {
              xAxes: [{
                display: true,
                scaleLabel: {
                  display: true,
                  // labelString: '檢驗日期',
                  // position:'right',
                  fontSize: 16,
                }
              }],
              yAxes: [{
                display: true,
                // stacked: true, //PS. 如果使用線標示的數據會錯誤
                ticks: {
                  beginAtZero: false,
                  min:minSteps,
                  max:maxSteps,
                  stepSize:stepSizes,
                }
              }]
            },
//						          plotOptions: { series: { connectNulls: true } }, //1070411 add 預防斷線
            legend:{
              position:'top',
              padding:{
                left:10,
                right:10,
                top:10,
                bottom:10
              },
              labels:{
                boxWidth:15,
//							       fontColor:'black',
                fontSize: 18,
                //fontColor:'rbg(60,180,100)'
              }

            }
          }

        }
      },


    }

</script>

<style scoped>

  .chart-container {
    position: relative;
    margin: auto;
    height: 80vh;
    width: 80vw;
  }

  #TprTableContent{
    padding-top: 5px;
    padding-left: 10px;
    padding-right: 10px;
    overflow-y: auto;
  }
  #TprContent2{
    overflow-y: auto;
  }


</style>
