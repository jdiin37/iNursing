
<template>
  <v-app id="curry">
    <div>
      <v-btn color="success"  @click="API_get">Get</v-btn>
      <v-btn color="error" @click="API_post">Post</v-btn>
      <v-btn color="warning">Put</v-btn>
      <v-btn color="info">Delete</v-btn>
      <v-btn color="info" @click="update_chartData">update chart</v-btn>
      <v-btn color="info" @click="update_chartData2">update chart2</v-btn>
      <v-btn color="info" @click="API_test_TPR">test_TPR</v-btn>


    </div>

    <br/>
    <div>
      <span>您現在選擇的病人是:</span>
      <span>病歷號:{{this.selectPat.chart_no}}</span>
      <span>床號:{{this.selectPat.bed_no}}</span>
      <span>姓名:{{this.selectPat.pt_name}}</span>
      <span>性別:{{this.selectPat.sex_name}}</span>
    </div>
    <div grid-list-xl text-xs-center>
      <v-layout row wrap>
        <v-flex xs12 md3 px-1>
          <v-text-field  v-model="filter_chart_no"  label="病歷號"></v-text-field>
        </v-flex>
        <v-flex xs12 md3 px-1>
          <!--<v-text-field  v-model="filter_doctor" solo-inverted label="醫師"></v-text-field>-->
          <v-select
            :items="[
            { text: '' },
          { text: 'D01' },
          { text: 'D02' },
          { text: 'D18' }
        ]"
            v-model="filter_doctor"
            label="醫師"
            item-value="text"
          ></v-select>
        </v-flex>
        <v-flex xs12 md3>
          <v-text-field v-model="filter_station" solo-inverted label="護理站"></v-text-field>
        </v-flex>
      </v-layout>
    </div>

    <v-data-table
      :headers="pat_headers"
      :items="customFilter"
      :rows-per-page-items='[10,15,20,{"text":"All","value":-1}]'
      :loading="false"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <tr @click="selectRow(props.item)">
          <td>{{ props.item.chart_no }}</td>
          <td>{{ props.item.bed_no }}</td>
          <td>{{ props.item.pt_name }}</td>
          <td>{{ props.item.sex_name }}</td>
          <td>{{ props.item.type_name }}</td>
          <td>{{ props.item.part_no }}</td>
          <td>{{ props.item.card_seq }}</td>
          <td>{{ props.item.ckin_date }}</td>
          <td>{{ props.item.vs }}</td>
          <td>{{ props.item.discharge_date }}</td>
          <td>{{ props.item.admit_days }}</td>
          <td>{{ props.item.status }}</td>
        </tr>
      </template>
      <template slot="no-data">
        <v-alert :value="true" color="error" icon="warning">
          對不起, 目前沒有資料:(
        </v-alert>
      </template>
      <template slot="pageText" slot-scope="props">
        Lignes {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
      </template>
    </v-data-table>
    <br/>
    <template>
      <!--<ChartExample></ChartExample>-->
      <!--<ChartExample2></ChartExample2>-->
      <!--<chartff></chartff>-->
      <ChartExample3 :chartData="chartData" :options="chartOptions"></ChartExample3>
    </template>

    <!--<v-data-table-->
      <!--:headers="headers"-->
      <!--:items="desserts"-->
      <!--hide-actions-->
      <!--class="elevation-1"-->
    <!--&gt;-->
      <!--<template slot="items" slot-scope="props">-->
        <!--<td>{{ props.item.name }}</td>-->
        <!--<td class="text-xs-right">{{ props.item.calories }}</td>-->
        <!--<td class="text-xs-right">{{ props.item.fat }}</td>-->
        <!--<td class="text-xs-right">{{ props.item.carbs }}</td>-->
        <!--<td class="text-xs-right">{{ props.item.protein }}</td>-->
        <!--<td class="text-xs-right">{{ props.item.iron }}</td>-->
      <!--</template>-->
      <!--<template slot="pageText" slot-scope="props">-->
        <!--Lignes {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}-->
      <!--</template>-->
    <!--</v-data-table>-->
  </v-app>
</template>

<script>
    import Qs from 'qs';
    import Chartff from "./Chart";
    import ChartExample from '@/components/testChart'
    import ChartExample2 from '@/components/testChart2'
    import ChartExample3 from '@/components/testChart3'


    export default {
        name: "Curry",
        components:{Chartff,ChartExample,ChartExample2,ChartExample3},
      data () {
        return {
          filter_chart_no: '',
          filter_doctor: '',
          filter_station:'',
          chartData:{
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
              {
                label: 'Data One',
                backgroundColor: '#f87979',
                borderColor: '#f87979',
                fill: false,
                data: [40, 39, 10, 40, 39, 80, 40],

              },
              {
                label: 'Data Two',
                backgroundColor: 'green',
                borderColor: 'green',
                fill: false,
                data: [10, 26, 30, 18, 21, 60, 46],

              }
            ]
          },
          chartOptions:{
            legend: {
              position: 'left',
              // onClick: function(event, legendItem) {
              //   //get the index of the clicked legend
              //   var index = legendItem.datasetIndex;
              //   //toggle chosen dataset's visibility
              //   console.log(legendItem);
              // }
            },
            responsive: true, maintainAspectRatio: false,
            spanGaps: true,//不斷線
            elements: {
              line: {
                tension: 0
              }
            },
            hover: {
              // mode: false
            },
            // Container for pan options
            // pan: {
            //   // Boolean to enable panning
            //   enabled: false,
            //
            //   // Panning directions. Remove the appropriate direction to disable
            //   // Eg. 'y' would only allow panning in the y direction
            //   mode: 'xy',
            //   rangeMin: {
            //     // Format of min pan range depends on scale type
            //     x: null,
            //     y: null
            //   },
            //   rangeMax: {
            //     // Format of max pan range depends on scale type
            //     x: null,
            //     y: null
            //   }
            // },
            //
            // // Container for zoom options
            // zoom: {
            //   // Boolean to enable zooming
            //   enabled: true,
            //
            //   // Enable drag-to-zoom behavior
            //   drag: false,
            //
            //   // Zooming directions. Remove the appropriate direction to disable
            //   // Eg. 'y' would only allow zooming in the y direction
            //   mode: 'xy',
            //   rangeMin: {
            //     // Format of min zoom range depends on scale type
            //     x: null,
            //     y: null
            //   },
            //   rangeMax: {
            //     // Format of max zoom range depends on scale type
            //     x: null,
            //     y: null
            //   }
            // },
            plugins: {
              datalabels: {
                anchor: "bottom",
                align: "bottom",
                display: function(context) {
                  //console.log(context);
                  return context.chart.isDatasetVisible(context.datasetIndex); // display labels with an odd index
                },
                font: {
                  weight: 'bold',
                  size: 14,
                },
              }
            },
            // plugins: [
            //   {
            //     id: 'kwhWeek',
            //     beforeDraw(chart) {
            //       console.log(chart)
            //       const width = chart.chart.width;
            //       const height = chart.chart.height;
            //       const ctx = chart.chart.ctx;
            //       ctx.restore();
            //       const fontSize = (height / 114).toFixed(2);
            //       ctx.font = `${fontSize}em sans-serif`;
            //       ctx.textBaseline = 'middle';
            //       const text = '4511kWh';
            //       const textX = Math.round((width - ctx.measureText(text).width) / 2);
            //       const textY = height / 2;
            //       ctx.fillText(text, textX, textY);
            //       ctx.save();
            //     },
            //   },
            // ],
            animationDuration: 0, // duration of animations when hovering an item
            animation: {

              onProgress: function(animation) {
                //alert('ttt');
                //console.log(animation.animationObject.currentStep / animation.animationObject.numSteps);
                //progress.value = animation.animationObject.currentStep / animation.animationObject.numSteps;
                // var ctx = this.chart.ctx;
                //
                // //console.log(ctx);
                // ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
                // ctx.fillStyle = "black";
                // ctx.textAlign = 'center';
                // ctx.textBaseline = 'bottom';
                //
                // this.data.datasets.forEach(function (dataset)
                // {
                //   for (var i = 0; i < dataset.data.length; i++) {
                //     for(var key in dataset._meta)
                //     {
                //       var model = dataset._meta[key].data[i]._model;
                //       ctx.fillText(dataset.data[i], model.x, model.y - 5);
                //     }
                //   }
                // });
              },
              onComplete: function () {
                // var ctx = this.chart.ctx;
                //
                // //console.log(ctx);
                // ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
                // ctx.fillStyle = "black";
                // ctx.textAlign = 'center';
                // ctx.textBaseline = 'bottom';
                //
                // this.data.datasets.forEach(function (dataset)
                // {
                //   for (var i = 0; i < dataset.data.length; i++) {
                //     for(var key in dataset._meta)
                //     {
                //       var model = dataset._meta[key].data[i]._model;
                //       ctx.fillText(dataset.data[i], model.x, model.y - 5);
                //     }
                //   }
                // });
              }
            }
          },
          pat_headers:[

            { text: '病歷號碼', value: 'chart_no' },
            { text: '床位', value: 'bed_no' },
            { text: '病患姓名', value: 'pt_name' },
            { text: '性別', value: 'sex_name' },
            { text: '身分', value: 'type_name' },
            { text: '負擔', value: 'part_no' },
            { text: '卡號', value: 'card_seq' },
            { text: '住院日期', value: 'ckin_date' },
            { text: '醫師', value: 'vs' },
            { text: '出院日期', value: 'discharge_date' },
            { text: '住院日數', value: 'admit_days' },
            { text: '備註', value: 'status' },
          ],
          pats:[

          ],
          selectPat:{

          },
          headers: [
            {
              text: 'Dessert (100g serving)',
              align: 'left',
              sortable: false,
              value: 'name'
            },
            { text: 'Calories', value: 'calories' },
            { text: 'Fat (g)', value: 'fat' },
            { text: 'Carbs (g)', value: 'carbs' },
            { text: 'Protein (g)', value: 'protein' },
            { text: 'Iron (%)', value: 'iron' }
          ],
          desserts: [
            {
              value: false,
              name: 'Frozen Yogurt',
              calories: 159,
              fat: 6.0,
              carbs: 24,
              protein: 4.0,
              iron: '1%'
            },
            {
              value: false,
              name: 'Ice cream sandwich',
              calories: 237,
              fat: 9.0,
              carbs: 37,
              protein: 4.3,
              iron: '1%'
            },
            {
              value: false,
              name: 'Eclair',
              calories: 262,
              fat: 16.0,
              carbs: 23,
              protein: 6.0,
              iron: '7%'
            },
            {
              value: false,
              name: 'Cupcake',
              calories: 305,
              fat: 3.7,
              carbs: 67,
              protein: 4.3,
              iron: '8%'
            },
            {
              value: false,
              name: 'Gingerbread',
              calories: 356,
              fat: 16.0,
              carbs: 49,
              protein: 3.9,
              iron: '16%'
            },
            {
              value: false,
              name: 'Jelly bean',
              calories: 375,
              fat: 0.0,
              carbs: 94,
              protein: 0.0,
              iron: '0%'
            },
            {
              value: false,
              name: 'Lollipop',
              calories: 392,
              fat: 0.2,
              carbs: 98,
              protein: 0,
              iron: '2%'
            },
            {
              value: false,
              name: 'Honeycomb',
              calories: 408,
              fat: 3.2,
              carbs: 87,
              protein: 6.5,
              iron: '45%'
            },
            {
              value: false,
              name: 'Donut',
              calories: 452,
              fat: 25.0,
              carbs: 51,
              protein: 4.9,
              iron: '22%'
            },
            {
              value: false,
              name: 'KitKat',
              calories: 518,
              fat: 26.0,
              carbs: 65,
              protein: 7,
              iron: '6%'
            }
          ],
          test_tpr_data:null,
        }
      },
      computed: {
        customFilter() {
          return this.pats.filter((i) => {
            return (!this.filter_chart_no || (i.chart_no.toString().indexOf(this.filter_chart_no) >=0)) && (!this.filter_doctor || (i.vs.indexOf(this.filter_doctor) >= 0)) ;
          })
        }
      },
      // mounted () {
      //   this.update_chartData();
      // },
      methods:{
        update_chartData:function(){

          let newchartData={
            labels: ['tom', 'john', 'apple', 'ted', 'mary', 'amy', 'tony stork'],
              datasets: [
              {
                label: 'math',
                backgroundColor: '#f87979',
                borderColor: '#f87979',
                fill: false,
                data: [40, 39, 10, 40, 39, 80, 40],

              },
              {
                label: 'english',
                backgroundColor: 'green',
                borderColor: 'green',
                fill: false,
                data: [10, 26, 30, 18, 21, 60, 46],

              }
            ]
          }
          this.chartData =newchartData;
        },
        update_chartData2:function(){
          let newchartData={
            labels: ['tom', 'john', 'apple', 'ted', 'mary', 'amy', 'tony stork'],
            datasets: [
              {
                label: 'math',
                backgroundColor: '#f87979',
                borderColor: '#f87979',
                fill: false,
                data: [40, 39, 10, 40, 39, 80, 40],

              },
              {
                label: 'english',
                backgroundColor: 'green',
                borderColor: 'green',
                fill: false,
                data: [10, 26, 30, 18, 21, 60, 46],

              },
              {
                label: 'chinese',
                backgroundColor: 'blue',
                borderColor: 'blue',
                fill: false,
                data: [56, 78, 45, 36, 29, 30, 46],

              }
            ]
          }
        this.chartData =newchartData;
        },
        selectRow:function(item){
          console.log(item);
          this.selectPat = item;
          //alert('ccc');
        },
        API_get: function () {
          let url = "/rest/login/" + "ORCL" + "/" + "ORCL"
          this.$http.get(url)
            .then(response =>{
              this.loginUser = response.data.resultSet;
              console.log("Login : " + this.loginUser[0].empName);
              //this.$router.replace('home');
              //this.$router.push('home');
              //this.$router.push('curry')
            })
            .catch(error =>  {
              console.log("Login: error : " + error);
              try {
                this.message = error.response.data.message;
                this.showMessage = true;
              } catch(err) {
                this.message = error.toString();
              }
            });

        },
        API_post:function(){
          let url = "http://172.16.2.189:8080/TanTimaServices/servlets/ServletAgent";
          // var bodyFormData = new FormData();
          // bodyFormData.append('serviceName','PatientListService');
          // bodyFormData.append('parameters',{"empNo": "ORCL", "sessionID": 9838, "method": "getPatinpListInp"});
          let postdata = {
            serviceName: 'PatientListService',
            parameters: '{"empNo": "ORCL", "sessionID": 9838, "method": "getPatinpListInp"}'
          };
          var data = Qs.stringify(postdata);

          this.$http.post(url,data,{headers:{'Content-Type':'application/x-www-form-urlencoded'}})
            .then(response =>{
              this.pats = response.data.resultSet;
              //console.log(this.pats);
            })
            .catch(error =>  {
              console.log("Post: error : " + error);
              try {
                // this.message = error.response.data.message;
                // this.showMessage = true;
              } catch(err) {
                this.message = error.toString();
              }
            });
        },
        API_test_TPR:function(){
          let url = "http://172.16.2.189:8080/TanTimaServices/servlets/ServletAgent";
          // var bodyFormData = new FormData();
          // bodyFormData.append('serviceName','PatientListService');
          // bodyFormData.append('parameters',{"empNo": "ORCL", "sessionID": 9838, "method": "getPatinpListInp"});
          let postdata = {
            serviceName: 'TPRRecordService',
            parameters: '{"empNo":"ORCL","sessionID":"9852","chartNo":"158689","serno":"133162","method":"getTPRRecordByChartNoSerno"}'
          };
          var data = Qs.stringify(postdata);

          this.$http.post(url,data,{headers:{'Content-Type':'application/x-www-form-urlencoded'}})
            .then(response =>{
              this.test_tpr_data = response.data.resultSet;
               console.log(response.data.resultSet);
              //console.log(this.pats);
            })
            .catch(error =>  {
              console.log("Post: error : " + error);
              try {
                // this.message = error.response.data.message;
                // this.showMessage = true;
              } catch(err) {
                this.message = error.toString();
              }
            });
        },
        update_chartTPR:function(){

          let datasets=[
            {
              label: '體溫',
              backgroundColor: '#2259CA',
              borderColor: '#2259CA',
              fill: false,
              data: [],

            },
            {
              label: '脈搏',
              backgroundColor: '#F13967',
              borderColor: '#F13967',
              fill: false,
              data: [],

            },
            {
              label: '呼吸',
              backgroundColor: '#292929',
              borderColor: '#292929',
              fill: false,
              data: [],

            },
            {
              label: '收縮壓',
              backgroundColor: '#088DBA',
              borderColor: '#088DBA',
              fill: false,
              data: [],

            },
            {
              label: '舒張壓',
              backgroundColor: '#139B53',
              borderColor: '#139B53',
              fill: false,
              data: [],

            },
            {
              label: '體重',
              backgroundColor: '#442978',
              borderColor: '#442978',
              fill: false,
              data: [],
            },
            {
              label: '注射量',
              backgroundColor: '#868686',
              borderColor: '#868686',
              fill: false,
              data: [],
            },
            {
              label: '出血量',
              backgroundColor: '#FF1705',
              borderColor: '#FF1705',
              fill: false,
              data: [],
            },
            {
              label: 'Urine',
              backgroundColor: '#FFCE43',
              borderColor: '#FFCE43',
              fill: false,
              data: [],
            }
          ];
          let labels =[];
          //console.log(this.test_tpr_data);
          for(var i=0;i<this.test_tpr_data.length;i++){
           // console.log(i);
            labels.push(this.test_tpr_data[i].assess_date + " "+ this.test_tpr_data[i].assess_time);

            for(var j=0;j<datasets.length;j++){
              if(j == 0){
                datasets[j].data.push(this.test_tpr_data[i].temperature==0?null:this.test_tpr_data[i].temperature);
              }else if(j==1){
                datasets[j].data.push(this.test_tpr_data[i].pulse==0?null:this.test_tpr_data[i].pulse);
              }else if(j==2){
                datasets[j].data.push(this.test_tpr_data[i].respiration==0?null:this.test_tpr_data[i].respiration);
              }else if(j==3){
                datasets[j].data.push(this.test_tpr_data[i].systolic_pressure==0?null:this.test_tpr_data[i].systolic_pressure);
              }else if(j==4){
                datasets[j].data.push(this.test_tpr_data[i].diastolic_pressure==0?null:this.test_tpr_data[i].diastolic_pressure);
              }else if(j==5){
                datasets[j].data.push(this.test_tpr_data[i].weight==0?null:this.test_tpr_data[i].weight);
              }else if(j==6){
                datasets[j].data.push(this.test_tpr_data[i].iv_fluids==0?null:this.test_tpr_data[i].iv_fluids);
              }else if(j==7){
                datasets[j].data.push(this.test_tpr_data[i].bleed==0?null:this.test_tpr_data[i].bleed);
              }else if(j==8){
                datasets[j].data.push(this.test_tpr_data[i].urine==0?null:this.test_tpr_data[i].urine);
              }
            }
          }

          // console.log(labels);
          // console.log(datasets);
          let newchartData = {labels,datasets};
          // console.log(newchartData);
          this.chartData =newchartData;
        },
      },
      watch: {
        // whenever question changes, this function will run
        test_tpr_data: function (newdata, olddata) {
          //this.answer = 'Waiting for you to stop typing...'
          this.update_chartTPR();
        }
      },
    }
</script>

<style scoped>

</style>
