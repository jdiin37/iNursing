<template>
  <v-flex xs12>
    <v-card>
      <!--新增/編輯 Dialog視窗 activator (v-btn 包在v-dialog tab裡)觸發開啟 dialog-->
      <v-dialog v-model="dialog" max-width="500px">
        <!--<v-btn slot="activator" color="primary" dark class="mb-2">新增</v-btn>-->
        <v-btn v-if="tprChartNo!=''" slot="activator"  dark fab top right color="accent" class="mb-2 mt-0">
          <v-icon>add</v-icon>
        </v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{formTitle}}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field :rules="[rules.date]"  v-model="editedItem.assessDate" label="日期" :disabled="disableInput"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field :rules="[rules.time]"  v-model="editedItem.assessTime" label="時間" :disabled="disableInput"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field :rules="[rules.temp,rules.tempMin,rules.tempMax]" v-model="editedItem.temperature"  name="temperature" type="number" min="34.0" max="42.0" step="0.1" label="體溫" @keyup="inputChange"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field :rules="[rules.pulse,rules.pulseMin,rules.pulseMax]" v-model="editedItem.pulse" name="pulse" type="number" min="40" max="180" step="1" label="脈搏" @keyup="inputChange"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field  :rules="[rules.resp,rules.respMin,rules.respMax]"  v-model="editedItem.respiration" name="respiration" type="number" min="5" max="80" step="1" label="呼吸" @keyup="inputChange"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field :rules="[rules.weight,rules.weightMin,rules.weightMax]"  v-model="editedItem.weight" name="weight" type="number" min="30.0" max="200.0" step="0.1" label="體重" @keyup="inputChange"> </v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field  :rules="[rules.sp,rules.spMin,rules.spMax]"  v-model="editedItem.systolicPressure" name="systolicPressure" type="number" min="40" max="300" step="1" label="收縮壓" @keyup="inputChange"> </v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field  :rules="[rules.dp,rules.dpMin,rules.dpMax]"  v-model="editedItem.diastolicPressure" name="diastolicPressure" type="number" min="10" max="300" step="1" label="舒張壓" @keyup="inputChange"> </v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field :rules="[rules.painMin,rules.painMax]"  v-model="editedItem.pain" name="pain" type="number" min="0" max="10" step="1" label="疼痛" @keyup="inputChange"> </v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field  v-model="editedItem.abdominal" name="abdominal" type="number" label="腹圍" @keyup="inputChange"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field  v-model="editedItem.ivFluids" name="ivFluids" type="number" label="注射量" @keyup="inputChange"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.diet" name="diet" type="number" label="飲食量" @keyup="inputChange"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field  v-model="editedItem.bleed" name="bleed" label="輸血量" type="number" @keyup="inputChange"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field  v-model="editedItem.stool" name="stool" type="text" label="大便量" @keyup="inputChange"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field  v-model="editedItem.urine" name="urine" type="number" label="小便量" @keyup="inputChange"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field  v-model="editedItem.drainage" name="drainage" type="number" label="引流量" @keyup="inputChange"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="close">取消</v-btn>
            <v-btn color="blue darken-1" flat @click.native="save" :disabled="disableSaveBtn">送出</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!--v-data-table 屬性 hide-actions 不顯示頁數;  :pagination.sync="pagination" ; :rows-per-page-items="[20,50,100]" ; select-all ;v-model="selected" 多選checkBox-->
      <v-data-table
        id="TprTable"
        hide-actions
        :loading="loading"
        :pagination.sync="pagination"
        :rows-per-page-items='[{"text":"All","value":-1},5,10,20]'
        :rows-per-page-text='pageText'
        :headers="tprHeaders"
        :items="TPRDetailList"
        :search="search"
        v-model="selected"
        item-key="chart_no"
        class="elevation-1">
        <template slot="headers" slot-scope="props" >
          <tr>
            <!--<th>
              <v-checkbox
                :input-value="props.all"
                :indeterminate="props.indeterminate"
                primary
                hide-details
                @click.native="toggleAll">
              </v-checkbox>
            </th>-->
            <th v-for="header in props.headers"
                :key="header.text"
                :class="['column sortable',pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '','px-1']"
                @click="changeSort(header.value)">
              <v-icon small> arrow_upward</v-icon>
              <span v-html="header.text"></span>
              <!--{{header.text}}-->
            </th>
          </tr>
        </template>
        <template slot="items" slot-scope="props">
          <!--<tr :active="props.selected" @click="props.selected = !props.selected">-->
            <!--<td>
              <v-checkbox :input-value="props.selected" primary hide-details></v-checkbox>
            </td>-->
            <tr>
              <td class="justify-center layout px-0">
                <v-btn icon class="mx-0" @click.native.stop="editItem(props.item)">
                  <v-icon color="teal">edit</v-icon>
                </v-btn>
                <v-btn icon class="mx-0" @click.native.stop="deleteItem(props.item)">
                  <v-icon color="pink">delete</v-icon>
                </v-btn>
              </td>
            <td class="px-1 text-xs-center">{{ formatterDate(props.item.assessDate)}}</td>
            <td class="px-1 text-xs-center">{{ formatterDate(props.item.assessTime)}}</td>
            <td class="px-1 text-xs-center">{{ formatterZero(props.item.temperature) }}</td>
            <td class="px-1 text-xs-center">{{ formatterZero(props.item.pulse)}}</td>
            <td class="px-1 text-xs-center">{{ formatterZero(props.item.respiration)}}</td>
            <td class="px-1 text-xs-center">{{formatterZero(props.item.systolicPressure)}} / {{ formatterZero(props.item.diastolicPressure)}}</td>
            <td class="px-1 text-xs-center">{{ props.item.pain}}</td>
            <td class="px-1 text-xs-center">{{ formatterZero(props.item.weight)}}</td>
            <td class="px-1 text-xs-center">{{ formatterZero(props.item.abdominal)}}</td>
            <td class="px-1 text-xs-center">{{ props.item.ivFluids}}</td>
            <td class="px-1 text-xs-center">{{ props.item.diet}}</td>
            <td class="px-1 text-xs-center">{{ props.item.bleed}}</td>
            <td class="px-1 text-xs-center">{{ props.item.stool}}</td>
            <td class="px-1 text-xs-center">{{ props.item.urine}}</td>
            <td class="px-1 text-xs-center">{{ props.item.drainage}}</td>
          </tr>
        </template>
        <template slot="pageText" slot-scope="props">
          第 {{ props.pageStart }} - {{ props.pageStop }} ,共 {{ props.itemsLength }} 筆
        </template>
        <template slot="no-data">
          <v-alert :value='loading' type="warning">
            資料讀取中, 請稍後...
          </v-alert>
          <v-alert :value='!loading' color="error" icon="warning">
            對不起, 目前沒有資料:(
          </v-alert>
        </template>
        <!--<v-alert slot="no-results" :value="true" color="error" icon="warning">-->
          <!--Your search for " {{ search }} " found no results.-->
        <!--</v-alert>-->
      </v-data-table>
      <v-layout row wrap>
        <v-flex xs12 md8 text-xs-center pt-2>
          <v-pagination v-model="pagination.page" :length="pages" :total-visible="7"></v-pagination>
        </v-flex>
        <v-flex xs6 md2 pt-2 pr-2 pl-2>
          <v-select
            :items="pageItem"
            label="每頁筆數"
            item-value="value"
            v-model="pagination.rowsPerPage"
          ></v-select>
        </v-flex>
        <v-flex xs6 md2 text-xs-left pt-2 pr-2>
          <v-text-field
            label="總筆數"
            v-model="pagination.totalItems"
            readonly
          ></v-text-field>
        </v-flex>
      </v-layout>

      <!--開啟Dialog v-btn 在 Dialog 外 不使用 slot="activator"  -->
      <!--<v-btn  color="primary" dark @click.native.stop="showCheckInfo()" class="mb-2">Checked Items</v-btn>-->
      <v-dialog v-model="deleteDialog" max-width="500">
        <v-card>
          <v-card-title class="headline">刪除 TPR 生命徵象紀錄單</v-card-title>
          <v-card-text v-html="deleteContent"></v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat="flat" @click.native="deleteDialog = false">取消</v-btn>
            <v-btn color="green darken-1" flat="flat" @click.native="confirmDelete">確定</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
    <v-snackbar
      :timeout="timeout"
      v-model="showSnack">
      {{SnackText}}
      <!--<v-btn dark flat @click.native="showSnack = false">Close</v-btn>-->
    </v-snackbar>
  </v-flex>
</template>

<script>
  // import * as MomentJs from 'vue-moment';
  import Vue from 'vue'
  import  MomentJs from 'vue-moment';
  Vue.use(MomentJs);

    export default {
        name: "TprRecordList",
        // props:['getTprData'],
      data () {
        return {
          pagination: {
            sortBy: 'assessDate',
            rowsPerPage:12,
          },
          pageItem:[
            {text:12,value:12},
            {text:20,value:20},
            {text:"All",value:-1},
          ],
          pageText:'每頁筆數 :',
          abdoRules:[v => v.length <=5 || '腹圍 數值異常'],
          rules: {
            required: value => !!value || 'Required.',
            counter: value => value.length <= 20 || 'Max 20 characters',
            /** 以下使用 vue-moment ↓**/
            date:value => {
              var isValidDate = this.isValidDate(value);
              return isValidDate || 'Invalid Date.'
            },
            time:value => {
              var isValidTime = this.isValidTime(value);
              return isValidTime || 'Invalid Time.'
            },
            /**vue-miment↑**/
            temp: v => (v!=null) || '34.0 ~ 42.0 (°C)',
            // temp: v => (v!=null&&v.length <= 4) || '34.0 ~ 42.0 (°C)',
            // tempMin: v=> ((v==''&&v.length>2)|| v>=34.0) || '體溫過低',
            // tempMin: v=> ((v!=''&&v.length<0)||(v!=''&&v>=34.0)) || '體溫過低',
            tempMin: v=> (((v==''&&v.length>=0)||(v)>=34.0))|| '體溫過低',
            tempMax: v => v<=42.0 || '體溫過高',
            tempVal: val => (val!=null&&(val || '').length < 0) || '',
            // pulse: v => (v!=null&&v.length <= 3) || '40 ~ 180 (次/分)',
            pulse: v => (v!=null) || '40 ~ 180 (次/分)',
            pulseMin: v=> (((v==''&&v.length>=0)||(v)>=40))|| '脈搏過低',
            pulseMax: v=> v<=180 || '脈搏過高',
            pulseVal: val => (val!=null&&(val || '').length > 0) || '',
            // pulseVal: val => (val || '').length > 0 || '',
            // resp: v => (v!=null&&v.length <= 2 )|| '5 ~ 80 (次/分)',
            resp: v => (v!=null)|| '5 ~ 80 (次/分)',
            respMin: v=> (((v==''&&v.length>=0)||(v)>=5))|| '呼吸過低',
            respMax: v=> v<=80 || '呼吸過高',
            respVal: val => (val!=null&&(val || '').length > 0) || '',
            weight: v => (v!=null) || '30.0 ~ 200.0 (kg)',
            weightMin: v=> (((v==''&&v.length>=0)||(v)>=30)) || '體重過低',
            weightMax: v => v<=200.0 || '體重過高',
            weightVal: val => (val!=null&&(val || '').length > 0) || '',
            sp: v => (v!=null) || '40 ~ 300 (mmHg)',
            spMin: v=> (((v==''&&v.length>=0)||(v)>=40))|| '收縮壓過低',
            spMax: v=> v<=300 || '收縮壓過高',
            spVal: val => (val!=null&&(val || '').length > 0) || '',
            dp:v => (v!=null) || '10 ~ 300 (mmHg)',
            dpMin: v=> (((v==''&&v.length>=0)||(v)>=10))|| '舒張壓過低',
            dpMax: v=> v<=300 || '舒張壓過高',
            dpVal: val => (val!=null&&(val || '').length) > 0 || '',
            pain: v => (v!=null) || '(vas 0-10)',
            painMin: v=> v>=0 || '疼痛指數(vas 0-10)',
            painMax: v=> v<=10 || '疼痛指數(vas 0-10)',
          },
          loading:false,
          tprChartNo:912473,
          tprSerno:107689,
          disableInput:false,
          disableSaveBtn:false,
          selected: [],
          dialog: false,
          deleteDialog: false,
          deleteContent:'',
          search: '',
          showSnack: false,
          timeout: 2000,
          SnackText: 'SnackBar',
          editedIndex: -1,
          deletedIndex:-1,
          editedItem: {
            assessDate: '',
            assessTime: '',
            temperature: '',
            pulse: '',
            respiration: '',
            systolicPressure: '',
            diastolicPressure: '',
            pain:'',
            weight: '',
            abdominal:'',
            ivFluids: '',
            diet: '',
            bleed: '',
            stool: '',
            urine: '',
            drainage: '',
            chartNo: '',
            keyinClerk: '',
            keyinDate: '',
            keyinTime: '',
            serno: '',

          },
          defaultItem: {
            assessDate: '',
            assessTime: '',
            temperature:'',
            pulse:'',
            respiration: '',
            systolicPressure: '',
            diastolicPressure: '',
            pain:'',
            weight: '',
            abdominal:'',
            ivFluids: '',
            diet: '',
            bleed: '',
            stool: '',
            urine: '',
            drainage: '',
            chartNo: '',
            keyinClerk: '',
            keyinDate: '',
            keyinTime: '',
            serno: '',
          },
          TPRDetailList:[],
          //TPR明細 標頭
          tprHeaders:[
            {
              text: '',
              align: 'center',
              // value: 'assessDate'
            },
            {
              text: '日期 ',
              // align: 'left',
              value: 'assessDate',
              class:'px-1'
            },
            {
              text: '時間 ',
              // align: 'center',
              value: 'assessTime',
              class:'px-1'
            },
            {
              text: '體溫<br/>(°C)',
              // align: 'left',
              value: 'temperature',
              class:'px-1'
            },
            {
              text: '脈搏<br/>(次/分)',
              // align: 'left',
              value: 'pulse',
              class:'px-1'
            },
            {
              text: '呼吸<br/>(次/分)',
              // align: 'left',
              value: 'respiration',
              class:'px-1'
            },
            {
              text: '血壓(mmHg)<br/>(收縮/舒張壓)',
              // align: 'left',
              value: 'systolicPressure',
              class:'px-1'
            },
            {
              text: '疼痛<br/>(vas 0-10)',
              // align: 'left',
              value: 'pain',
              class:'px-1'
            },
            {
              text: '體重<br/>(kg)',
              // align: 'left',
              value: 'weight',
              class:'px-1'
            },
            {
              text: '腹圍<br/>(cm)',
              // align: 'left',
              value: 'abdominal',
              class:'px-1'
            },
            {
              text: '注射量<br/>(cc)',
              // align: 'left',
              value: 'ivFluids',
              class:'px-1'
            },
            {
              text: '飲食量<br/>(cc)',
              // align: 'left',
              value: 'diet',
              class:'px-1'
            },
            {
              text: '輸血量<br/>(cc)',
              // align: 'left',
              value: 'bleed',
              class:'px-1'
            },
            {
              text: '大便量<br/>(cc)',
              // align: 'center',
              value: 'stool',
              class:'px-1'
            },
            {
              text: '小便量<br/>(cc)',
              // align: 'left',
              value: 'urine',
              class:'px-1'
            },
            {
              text: '引流量<br/>(cc)',
              // align: 'left',
              value: 'drainage',
              class:'px-1'
            },

          ]

        }
      },
      created() {
        // console.log("TPR RecordList created() !!");
        this.axios_getTprDetailListData();

      },
      mounted() {
        window.onresize = function(event) {

          var userHeight = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;
          var TprTable = document.getElementById('TprTable');
          var height = userHeight-(64+60+36+10+40+120);
          if(TprTable){
            TprTable.setAttribute('style','overflow-y: auto;min-height:'+height+'px;max-height:'+height+'px;');
            // TprTable.style.height = (height) + 'px';
          }
        };

      },
      methods: {
        isValidDate:function(date){
          if(date==null || date =='' || date==undefined){
            return false
          }
          if(date.length==7){
            var y =(parseInt(date.substring(0, 3))+1911);
            var m = date.substring(3, 5);
            var d = date.substring(5, 7);

            if(this.$moment(y+m+d+"","YYYYMMDD").isValid()){
              // console.log(date);
              return true;
            }else {
              return false;
            }
          }else {
            return false;
          }

        },
        isValidTime:function(time){
          if(time==null || time =='' || time==undefined){
            return false
          }
          if(time.length==4){
            if(this.$moment(time,"HHmm").isValid()){
              // console.log(time);
              return true;
            }else {
              return false;
            }
          }else {
            return false;
          }
        },
        getNowDate:function(){
          var now = new Date();
          var month = now.getMonth()+1;
          var day = now.getDate();
          var year = now.getFullYear();
          var m = parseInt(month);
          var d = parseInt(day);
          var M = m<10?'0'+m:m;
          var D = d<10?'0'+d:d;
          var Y = year<1000?year:year-1911;
          return Y+""+M+""+D;
        },
        getNowTime:function(){
          var now = new Date();
          var hour = now.getHours();
          var minutes = now.getMinutes();
          var hrs = hour<10?'0'+hour:hour;
          var mins = minutes<10?'0'+minutes:minutes;
          return hrs+""+mins;
        },
         formatterDate:function(date){
           return this.$UtilityJs.formatDateTime(date);
         },
        axios_postTprRecordData:function(postData){ //新增單筆資料
          let url = '/iNursingSrv/rest/tprrecord/s';
          this.$http.post(url,postData).then(response=>{
            if(response.data.status == "INFO"){
              let snackObj ={
                status:true,
                text:response.data.message,
                timeout:4000,
                closeText:''
              };
              this.$store.commit('setSnackBar',snackObj);
              this.axios_getTprDetailListData();
            }
          }).catch(error =>{
            try{
              let snackObj ={
                status:true,
                text:error.response.data.message,
                timeout:4000,
                closeText:''
              };
              this.$store.commit('setSnackBar',snackObj);
            }catch (e) {

            }
          });
        },
        axios_putTprRecordData:function(postData){ //修改單筆資料
          let url = '/iNursingSrv/rest/tprrecord/s';
          this.$http.put(url,postData).then(response=>{
            if(response.data.status == "INFO"){
              let snackObj ={
                status:true,
                text:response.data.message,
                timeout:4000,
                closeText:''
              };
              this.$store.commit('setSnackBar',snackObj);
              this.axios_getTprDetailListData();
            }
          }).catch(error =>{
            try{
              let snackObj ={
                status:true,
                text:error.response.data.message,
                timeout:4000,
                closeText:''
              };
              this.$store.commit('setSnackBar',snackObj);
            }catch (e) {

            }
          });
        },
        axios_deleteTprRecordData:function(chartNo,serno,assessDate,assessTime){   //刪除單筆資料
          let url = '/iNursingSrv/rest/tprrecord/s/'+chartNo+'/'+serno +'/'+assessDate+'/'+assessTime;
          this.$http.delete(url).then(response=>{
            if(response.data.status == "INFO"){
              let snackObj ={
                status:true,
                text:response.data.message,
                timeout:4000,
                closeText:''
              };
              this.$store.commit('setSnackBar',snackObj);
              this.axios_getTprDetailListData();
            }
          }).catch(error =>{
            try{
              let snackObj ={
                status:true,
                text:error.response.data.message,
                timeout:4000,
                closeText:''
              };
              this.$store.commit('setSnackBar',snackObj);
            }catch (e) {

            }
          });
        },
        axios_getTprDetailListData: function () { //axios get 查詢
          this.tprChartNo = this.patientInfo.chartNo;
          this.tprSerno = this.patientInfo.serno;
          if(this.tprChartNo==''||this.tprSerno==''){ //如果使用者沒有選擇病人的話
            this.$store.state.SystemControl.AppHome_patientListStatus = false;
            this.$store.commit('togglePtList'); //幫他自動開啟病人清單
          }else {
            this.loading = true;
            let url = "/iNursingSrv/rest/tprrecordchart/bychartnoserno/" + this.tprChartNo + "/" + this.tprSerno
            // let url = "/iNursingSrv/rest/tprrecord/"+ this.tprChartNo + "/" + this.tprSerno
            this.$http.get(url)
              .then(response =>{ //resultSet length
                this.TPRDetailList = response.data.resultSet;
                this.loading = false;
                if(this.TPRDetailList==undefined){ //如果從來都沒有紀錄 則將 Array 設為空陣列
                  this.TPRDetailList=[];
                }


                var userHeight = window.innerHeight
                  || document.documentElement.clientHeight
                  || document.body.clientHeight;
                var TprTable = document.getElementById('TprTable');
                var height = userHeight-(64+60+36+10+40+120);

                if(TprTable){
                  TprTable.setAttribute('style','overflow-y: auto;min-height:'+height+'px;max-height:'+height+'px;');
                  // TprTable.style.height = (height) + 'px';
                }
              })
              .catch(error =>  {
                // console.log("TprDetailList: error : " + error);
                try {
                  console.log(error.response.data.message);
                } catch(err) {

                }
                this.loading = false;
              });
          }
        },
        editItem:function(item){
          this.editedIndex = this.TPRDetailList.indexOf(item);
          var index = this.editedIndex;
          var keyinClerk = this.TPRDetailList[index].keyinClerk;
          // console.log();
          if( keyinClerk == this.loginUser.empNo){ //如果 輸入者是登入者則可以編輯，否則彈出 SnackBar  this.loginUser.empNo
            this.disableInput = true; //編輯狀態不可修改日期和時間
            this.editedItem = Object.assign({},item);
            this.dialog = true;
          }else{
            this.showSnack = true;
            this.SnackText = '您並非輸入者 '+ keyinClerk + ' 無編輯權限'
            this.editedIndex = -1;
          }
          // console.log( "Now is"+ this.editedIndex)
        },
        deleteItem:function(item){  //點下刪除icon，需confirm 是否有權限可以刪除 deleteDialog == true , 否則則彈出 SnackBar 警告使用者無權限
          const  index = this.TPRDetailList.indexOf(item);
          var keyinClerk = this.TPRDetailList[index].keyinClerk;
          // var loginUser =  this.$store.state.loginUser;
          // console.log(this.loginUser.empNo)

          if(keyinClerk == this.loginUser.empNo){ //如果輸入者是登入者則可以刪除紀錄，否則彈出 SnackBar
            var delText = ('確定要刪除 <br/> 日期:' +this.TPRDetailList[index].assessDate +" <br/>時間:"+this.TPRDetailList[index].assessTime);
            // confirm('確定要刪除 \n 日期:' +this.TPRDetailList[index].assess_date +" 時間:"+this.TPRDetailList[index].assess_time) && this.TPRDetailList.splice(index,1);
            this.deleteDialog = true;
            this.deleteContent= delText;
            this.deletedIndex = index;
          }else{
            this.showSnack = true;
            this.SnackText = '您並非輸入者 '+ keyinClerk + ' 無刪除權限'
            this.editedIndex = -1;
          }

        },
        confirmDelete:function () {  //確定刪除TPR，關閉Dialog 且 呼叫 刪除API
          var index = this.deletedIndex;
          this.tprChartNo = this.patientInfo.chartNo;
          this.tprSerno = this.patientInfo.serno;
          this.axios_deleteTprRecordData(this.tprChartNo,this.tprSerno,this.TPRDetailList[index].assessDate,this.TPRDetailList[index].assessTime);
          // this.TPRDetailList.splice(listIndex,1);
          this.deleteDialog = false;


        },
        close:function(){
          this.dialog = false;
          setTimeout(() =>{
            this.editedItem = Object.assign({},this.defaultItem)
            this.editedIndex = -1
          },300)
        },
        save:function(){
          if(this.editedIndex >-1){ //在此呼叫 編輯TPR Api
            // Object.assign(this.TPRDetailList[this.editedIndex],this.editedItem)
            var index = this.editedIndex;
            // console.log('modify index=');
            // console.log(index);
            this.tprChartNo = this.patientInfo.chartNo;
            this.tprSerno = this.patientInfo.serno;
            let postData = {
              chartNo:this.tprChartNo,
              serno:this.tprSerno,
              assessDate: this.editedItem.assessDate,
              assessTime:this.editedItem.assessTime,
              temperature:this.editedItem.temperature==''?0:parseFloat(this.editedItem.temperature),
              systolicPressure:this.editedItem.systolicPressure==''?0:parseInt(this.editedItem.systolicPressure),
              diastolicPressure:this.editedItem.diastolicPressure==''?0:parseInt(this.editedItem.diastolicPressure),
              pulse:this.editedItem.pulse==''?0:parseInt(this.editedItem.pulse),
              respiration:this.editedItem.respiration==''?0:parseInt(this.editedItem.respiration),
              weight:this.editedItem.weight==''?0:parseFloat(this.editedItem.weight),
              abdominal:this.editedItem.abdominal==''?0:parseFloat(this.editedItem.abdominal),
              ivFluids:this.editedItem.ivFluids==''?0:parseInt(this.editedItem.ivFluids),
              diet:this.editedItem.diet==''?0:parseInt(this.editedItem.ivFluids),
              bleed:this.editedItem.bleed==''?0:parseInt(this.editedItem.bleed),
              stool:this.editedItem.stool,
              urine:this.editedItem.urine==''?0:parseInt(this.editedItem.urine),
              drainage:this.editedItem.drainage==''?0:parseInt(this.editedItem.drainage),
              pain:this.editedItem.pain==''?0:parseInt(this.editedItem.pain),
              keyinClerk:this.TPRDetailList[index].keyinClerk,
              keyinDate:this.TPRDetailList[index].keyinDate,
              keyinTime:this.TPRDetailList[index].keyinTime,
              modifyClerk:this.loginUser.empNo,
              modifyDate:this.getNowDate(),
              modifyTime:this.getNowTime(),
            }
            this.axios_putTprRecordData(postData);

            this.close()
          }else{ //新增
            var validDate = this.isValidDate(this.editedItem.assessDate);
            var validTime = this.isValidTime(this.editedItem.assessTime);

            if(this.editedItem.assessDate==''||this.editedItem.assessTime==''){
              //show snackbar 顯示
              this.showSnack = true
              this.SnackText = '請輸入日期 時間';
            }else{ //在此呼叫 新增TPR Api
              //測試用
              if(validDate&&validTime){ //日期/時間格式正確
                this.editedItem.keyinClerk = this.loginUser.empNo;
                this.tprChartNo = this.patientInfo.chartNo;
                this.tprSerno = this.patientInfo.serno;
                let postData = {
                  chartNo:this.tprChartNo,
                  serno:this.tprSerno,
                  assessDate: this.editedItem.assessDate,
                  assessTime:this.editedItem.assessTime,
                  temperature:this.editedItem.temperature==''?0:parseFloat(this.editedItem.temperature),
                  systolicPressure:this.editedItem.systolicPressure==''?0:parseInt(this.editedItem.systolicPressure),
                  diastolicPressure:this.editedItem.diastolicPressure==''?0:parseInt(this.editedItem.diastolicPressure),
                  pulse:this.editedItem.pulse==''?0:parseInt(this.editedItem.pulse),
                  respiration:this.editedItem.respiration==''?0:parseInt(this.editedItem.respiration),
                  weight:this.editedItem.weight==''?0:parseFloat(this.editedItem.weight),
                  abdominal:this.editedItem.abdominal==''?0:parseFloat(this.editedItem.abdominal),
                  ivFluids:this.editedItem.ivFluids==''?0:parseInt(this.editedItem.ivFluids),
                  diet:this.editedItem.diet==''?0:parseInt(this.editedItem.ivFluids),
                  bleed:this.editedItem.bleed==''?0:parseInt(this.editedItem.bleed),
                  stool:this.editedItem.stool,
                  urine:this.editedItem.urine==''?0:parseInt(this.editedItem.urine),
                  drainage:this.editedItem.drainage==''?0:parseInt(this.editedItem.drainage),
                  pain:this.editedItem.pain==''?0:parseInt(this.editedItem.pain),
                  keyinClerk:this.loginUser.empNo,
                  keyinDate:this.getNowDate(),
                  keyinTime:this.getNowTime(),
                  modifyClerk:this.loginUser.empNo,
                  modifyDate:this.getNowDate(),
                  modifyTime:this.getNowTime(),
                }
                this.axios_postTprRecordData(postData);
                // this.TPRDetailList.push(this.editedItem)//測試用 新增 Item
                this.close()
              }else{
                this.showSnack = true
                this.SnackText = '日期或時間格式錯誤';
              }
            }
          }

        },
        changeSort: function(column) {
          // console.log(column);
          if (this.pagination.sortBy === column) {
            this.pagination.descending = !this.pagination.descending
          } else {
            this.pagination.sortBy = column
            this.pagination.descending = false
          }
        },
        formatterZero:function (value) {
          return value == 0?'':value;
        },
        inputLimit:function(val,min,max){
          if((val.toString()).length==0){
            this.disableSaveBtn = false;

          }else if((val.toString()).length==1){ //只輸入一個字
            if(val<(min)){
              this.disableSaveBtn = true;
              this.showSnack = true;
              this.SnackText = '輸入的數字需介於 '+ min + ' ~ '+ max + '之間';

            }
          }else if((val.toString()).length>=2&&(max.toString()).length>=2){
            if(val < min){
              this.disableSaveBtn = true;
              this.showSnack = true;
              this.SnackText = '輸入的數字需介於 '+ min + ' ~ '+ max + '之間';
            }else if(val>(max)){  // val>(max-1)
              this.disableSaveBtn = true;
              this.showSnack = true;
              this.SnackText = '輸入的數字需介於 '+ min + ' ~ '+ max + '之間';
            }else{
              this.disableSaveBtn = false;

            }
          }else{
            this.disableSaveBtn = false;
            // this.showInputMessage=false;
          }
        },
        inputChange:function (event) {

          var val = event.target.value;
          var min = event.target.getAttribute('min');
          var max = event.target.getAttribute('max');
          // var name = event.target.getAttribute('name');
          min = parseInt(min);
          max = parseInt(max);
          val = parseInt(val);

          try{
            this.inputLimit(val,min,max);
          }catch (e) {

          }

        },
      },
      computed: {
        formTitle () {
          return this.editedIndex === -1 ? '新增 TPR 生命徵象紀錄單' : '編輯 TPR 生命徵象紀錄單'
        },
        patientInfo() { //取得共同參數 main.js 裡定義的 ()
          return this.$store.state.patientInfo;
        },
        loginUser(){
          return this.$store.state.loginUser;
        },
        pages () {
          if (this.pagination.rowsPerPage == null ||
            this.pagination.totalItems == null
          ) return 0
          this.pagination.totalItems = this.TPRDetailList.length; //20180716 fix vuetify new version bug
          this.pagination.page = 1

          return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
        }
      },
      watch:{
        dialog(val){
          if(this.editedIndex==-1&&this.dialog==true){ //editedIndex == -1 為新增，且Dialog為開啟狀態則預設 給定當天日期和時間
            this.disableInput = false; //新增狀態可修改日期和時間
            var now = new Date();
            var month = now.getMonth()+1;
            var day = now.getDate();
            var year = now.getFullYear();
            var m = parseInt(month);
            var d = parseInt(day);
            var M = m<10?'0'+m:m;
            var D = d<10?'0'+d:d;
            var Y = year<1000?year:year-1911;
            this.editedItem.assessDate = (Y+""+M+""+D);

            var hour = now.getHours();
            var minutes = now.getMinutes();
            var hrs = hour<10?'0'+hour:hour;
            var mins = minutes<10?'0'+minutes:minutes;

            this.editedItem.assessTime= hrs+""+mins;
          }else if(this.dialog==false){ //關閉視窗後 將 新增&編輯視窗的  送出Button 解鎖 & 顯示錯誤訊息的文字刪除
            this.disableSaveBtn = false;;
          }
          val || this.close()
        },
        'editedItem.assess_date' : function(val) { //監控使用者在關閉Dialog時更改日期 (editedIndex == -1 為新增) 亦可驗證日期格式
          if(this.editedIndex==-1&&this.dialog==false){
            this.editedItem.assessDate = val;

          }

        },
        'editedItem.assess_time' : function(val) { //監控使用者在關閉Dialog時更改時間 (editedIndex == -1 為新增) 亦可驗證日期格式
          if(this.editedIndex==-1&&this.dialog==false){
            this.editedItem.assessTime = val;
          }
        },

      }
    }
</script>

<style scoped>


</style>
