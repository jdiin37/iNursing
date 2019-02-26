<template>
  <v-card>
  <v-card-title>
      <v-layout row wrap >
        <v-flex xs12 md2 px-2>
          <v-text-field
            append-icon="search"
            v-model="chartNo"
            label="病歷號"
            @click:append="() => (listType == 'INP'||chartNo ? getPatByChartNo():getDisPat())"
            v-on:keyup.enter="() => (listType == 'INP'||chartNo ? getPatByChartNo():getDisPat())"
          ></v-text-field>
        </v-flex>
        <v-flex xs12 md2 px-2>
          <v-select
            :items="doctors"
            v-model="filter_vs"
            label="醫師"
            item-value="value"
          ></v-select>
        </v-flex>
        <v-flex xs12 md2 px-2>
          <v-select
            :items="stations"
            v-model="filter_ns"
            label="護理站"
            item-value="value"
          ></v-select>
        </v-flex>
        <v-flex xs12 md4 px-2>
          <v-radio-group v-model="listType"  row>
            <v-radio label="住院中" value='INP' :disabled="loading"></v-radio>
            <v-radio label="出院" value='DIS' :disabled="loading"></v-radio>
          </v-radio-group>
        </v-flex>
        <v-flex xs12 md2>
          <v-text-field v-if="listType=='DIS'"
            v-model="disDays"
            label="出院日數"
            append-icon="search"
            @click:append="() => (getDisPat())"
            v-on:keyup.enter="getDisPat"
          ></v-text-field>
        </v-flex>
      </v-layout>
  </v-card-title>
  <v-dialog v-model=" confirmDialog" max-width="500">
    <v-card>
      <v-card-title class="headline">{{confirmHead}}</v-card-title>
      <v-card-text v-html="confirmText"></v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" flat="flat" @click.native="confirmDialog = false">取消</v-btn>
        <v-btn color="green darken-1" flat="flat" @click.native="() => (confirmMethod == 'POST' ? addToMyPat():deleteFromMyPat())">確定</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-data-table
    :headers="headers"
    :items="customFilter"
    hide-actions
    :loading="loading"
    :pagination.sync="pagination"
    class="fix-height-1"
  >
    <template slot="pageText" slot-scope="props">
      第 {{ props.pageStart }} - {{ props.pageStop }} ,共 {{ props.itemsLength }} 筆
    </template>
    <template slot="items" slot-scope="props">
      <tr @click="selectPT(props.item)">
        <td class="justify-center layout px-0">
          <v-btn icon class="mx-0" @click.stop="showDialog(props.item)">
            <v-icon color="teal">{{ props.item.isMyPatient == "Y"? 'favorite' : 'favorite_border' }}</v-icon>
          </v-btn>
        </td>
        <td class="px-1">{{ props.item.chartNo }}</td>
        <td class="px-1">{{ props.item.ns }}</td>
        <td class="px-1"  style="min-width: 50px">{{ props.item.bedNo }}</td>
        <td class="px-1">{{ props.item.ptName }}</td>
        <td class="px-1">{{ props.item.sexName }}</td>
        <td class="px-1">{{ props.item.typeName }}</td>
        <td class="px-1" >{{ props.item.partNo }}</td>
        <td class="px-1">{{ props.item.cardSeq }}</td>
        <td class="px-1">{{ formate_Date(props.item.ckinDate) }}</td>
        <td class="px-1" style="min-width: 100px">{{ props.item.vs }}</td>
        <td class="px-1">{{ formate_Date(props.item.dischargeDate) }}</td>
        <td class="px-1">{{ props.item.admitDays }}</td>
        <td class="px-1" style="min-width: 300px">{{ props.item.statusStr }}</td>
      </tr>
    </template>
    <template slot="no-data">
      <v-alert :value='loading' type="warning">
        資料讀取中, 請稍後...
      </v-alert>
      <v-alert :value='!loading' color="error" icon="warning">
        對不起, 目前沒有資料:(
      </v-alert>
    </template>
  </v-data-table>
    <v-layout row wrap>
      <v-flex xs12 md8 text-xs-center pt-2>
        <v-pagination v-model="pagination.page" :length="pages" :total-visible="7" value=0></v-pagination>
      </v-flex>
      <v-flex xs6 md2 pr-2>
        <v-select
          :items="pageItem"
          label="每頁筆數"
          item-value="value"
          v-model="pagination.rowsPerPage"
        ></v-select>
      </v-flex>
      <v-flex xs6 md2 pr-2>
        <v-text-field
          label="總筆數"
          v-model="pagination.totalItems"
          readonly
        ></v-text-field>
      </v-flex>
    </v-layout>

  </v-card>
</template>

<script>
  import * as CommonJs from "@/js/common.js";
    export default {
      name: "InpPatientList1",
      props: ['myPats'],
      data () {
        return {
          confirmHead:'',
          confirmText:'',
          confirmDialog:false,
          confirmIndex:'',
          confirmMethod:'',
          pageItem:[
            {text:10,value:10},
            {text:20,value:20},
            {text:'ALL',value:9999},
          ],
          pagination: {
            sortBy: 'chartNo',
            rowsPerPage:10
          },
          loading:false,
          listType:'INP',
          disDays:'350',
          pageText:'每頁筆數 :',
          chartNo: '',
          filter_vs:'',
          filter_ns:'',
          stations:[],
          doctors:[],
          headers: [
            {
              text: '',
              align: 'center',
              //sortable:false,
              value:'isMyPatient',
              class:'px-1'
            },
            { text: '病歷號碼', value: 'chartNo',class:'px-1'},
            { text: '護理站', value: 'ns' ,class:'px-1'},
            { text: '床位', value: 'bedNo' ,class:'px-1'},
            { text: '病患姓名', value: 'ptName' ,class:'px-1'},
            { text: '性別', value: 'sexName' ,class:'px-1'},
            { text: '身分', value: 'typeName' ,class:'px-1'},
            { text: '負擔', value: 'partNo' ,class:'px-1'},
            { text: '卡號', value: 'cardSeq' ,class:'px-1'},
            { text: '住院日期', value: 'ckinDate' ,class:'px-1'},
            { text: '醫師', value: 'vs' ,class:'px-1'},
            { text: '出院日期', value: 'dischargeDate',class:'px-1' },
            { text: '住院日數', value: 'admitDays' ,class:'px-1'},
            { text: '備註', value: 'statusStr' ,class:'px-1'},

          ],
          pats:[]
        }
      },computed: {
        customFilter() {
          return this.pats.filter((i) => {
            return (!this.filter_vs || (i.vs.indexOf(this.filter_vs) >= 0)) && (!this.filter_ns || (i.ns.indexOf(this.filter_ns) >= 0)) ;
          })
        },
        pages () {
          if (this.pagination.rowsPerPage == null ||
            this.pagination.totalItems == null
          ) return 0

          this.pagination.totalItems = this.customFilter.length; //20180716 fix vuetify new version bug
          this.pagination.page = 1

          return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
        }
      },mounted:function(){
        this.getInpPat();
      },watch: {
        listType: function (newdata, olddata) {
          if(newdata == 'INP'){
            this.getInpPat();
          }else{
            this.getDisPat();
          }
        },
        myPats:function(newdata,olddata){
          if(this.pats.length > 0){
            var tempMyPats = []
            newdata.forEach(function (myPatObj) {
              tempMyPats.push(myPatObj['chartNo'] + '-' + myPatObj['serno'])
            })
            //console.log(tempMyPats)
            this.pats.forEach(function (patObj) {
              //console.log(patObj['chartNo'])
              if(tempMyPats.includes(patObj['chartNo'].toString() + '-' + patObj['serno'].toString())){
                patObj['isMyPatient'] = 'Y';
              }else{
                patObj['isMyPatient'] = 'N';
              }
            })
          }
        }
      },methods:{

        formate_Date:function(item){
          return CommonJs.formatDateTime(item);
        },
        getStations:function(){
          var tempNs = [];
          var stations = [{ text: '' ,value:null}];
          this.pats.forEach(function (patObj) {
            var ns = patObj['ns'];
            var nsName = patObj['nsName'];

            if (tempNs.indexOf(ns) === -1) {
              tempNs.push(ns);
              stations.push({text:nsName,value:ns});
            }
          });
          tempNs=null;
          this.stations = stations;
        },
        getDoctors:function(){
          var tempVs = [];
          var doctors = [{ text: '' ,value:null}];
          this.pats.forEach(function (patObj) {
            var vs = patObj['vs'];
            var vsName = patObj['vsName'];
            patObj.vs = vs + ' ' + vsName;
            if (tempVs.indexOf(vs) === -1) {
              tempVs.push(vs);
              doctors.push({text:vs + ' ' + vsName,value:vs});
            }
          });
          tempVs=null;
          this.doctors = doctors;
        },
        getPatByChartNo(){
          if(this.chartNo){
            this.iniData();
            this.loading = true;
            var empNo = this.$store.state.loginUser.empNo;
            if(!empNo){
              empNo = 'ORCL';
            }
            let url = "/iNursingSrv/rest/inpatient/bychartno/" + this.chartNo + "/" + empNo;
            this.$http.get(url)
              .then(response =>{
                this.pats = response.data.resultSet;
                this.getStations();
                this.getDoctors();
                this.loading = false;
              })
              .catch(error =>  {
                console.log("getInpPat: error : " + error);
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
                this.loading = false;
              });
          }else {
            this.getInpPat();
          }
        },
        getInpPat:function(){
          this.iniData();
          this.loading = true;
          var empNo = this.$store.state.loginUser.empNo;
          if(!empNo){
            empNo = 'ORCL';
          }
          let url = "/iNursingSrv/rest/inpatient/inhospital/" + empNo ;
          this.$http.get(url)
            .then(response =>{
              this.pats = response.data.resultSet;
              this.getStations();
              this.getDoctors();
              this.loading = false;
            })
            .catch(error =>  {
              console.log("getInpPat: error : " + error);
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
              this.loading = false;
            });

        },
        getDisPat:function(){
          this.iniData();
          this.loading = true;
          var empNo = this.$store.state.loginUser.empNo;
          if(!empNo){
            empNo = 'ORCL';
          }
          let url = "/iNursingSrv/rest/inpatient/discharged/bydays/" + this.disDays + "/" + empNo;
          this.$http.get(url)
            .then(response =>{
              this.pats = response.data.resultSet;
              this.getStations();
              this.getDoctors();
              this.loading = false;
            })
            .catch(error =>  {
              console.log("getDisPat: error : " + error);
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
              this.loading = false;
            });
        },
        selectPT:function (rowObj) {
          let selectPtObj = {
            chartNo : rowObj.chartNo,
            ptName : rowObj.ptName,
            bedNo : rowObj.bedNo,
            sex : rowObj.sexName,
            ckinDate : rowObj.ckinDate,
            admitDays : rowObj.admitDays,
            serno : rowObj.serno,
            pictContent:'',
          };
          this.$store.commit('selectPt', selectPtObj);
          //---get pic--
          this.getPic(rowObj.chartNo);
          //----
          this.$store.commit('togglePtList');
          this.$router.push('/home/episodesummary');
        },
        getPic:function(chartNo){
          let url = "iNursingSrv/rest/patientpict/chartno/" + chartNo;
          this.$http.get(url).then(response =>{
            if(response.data.resultSet){
              this.$store.commit('setPtPic',response.data.resultSet[0].pictContent);
            }
          })
            .catch(error =>  {
              console.log("getPic: error : " + error);
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
        },
        showDialog:function(rowObj){
          const index = this.pats.indexOf(rowObj);
          if(this.pats[index].isMyPatient == "N"){
            var confirmText = ( rowObj.ptName + '('+ rowObj.chartNo +') ' );
            this.confirmDialog = true;
            this.confirmHead = "加入我的照護病人";
            this.confirmText = confirmText;
            this.confirmIndex = index;
            this.confirmMethod = 'POST';
          }else{
            var confirmText = ( rowObj.ptName + '('+ rowObj.chartNo +') ' );
            this.confirmDialog = true;
            this.confirmHead = "移除我的照護病人";
            this.confirmText = confirmText;
            this.confirmIndex = index;
            this.confirmMethod = 'DELETE';
          }
        },
        addToMyPat:function (){
          var index =  this.confirmIndex;
          var empNo = this.$store.state.loginUser.empNo;
          if(!empNo){
            empNo = 'ORCL';
          }
          var postData ={
            empNo:empNo,
            chartNo:this.pats[index].chartNo,
            serno:this.pats[index].serno,
            note:""
          };
          let url = "/iNursingSrv/rest/mypatient/s";
          this.$http.post(url,postData)
            .then(response =>{
              //console.log(response.data);
              if(response.data.status == "INFO"){
                let snackObj ={
                  status:true,
                  text:response.data.message + ' ' + this.pats[index].ptName +'('+ this.pats[index].chartNo + ') 已加入我的照護病人',
                  timeout:4000,
                  closeText:''
                };
                this.$store.commit('setSnackBar',snackObj);
                this.pats[index].isMyPatient = "Y";
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
              console.log("addToMyPat: error : " + error);
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

          this.confirmDialog = false;
        },deleteFromMyPat:function() {
          var PatsIndex = this.confirmIndex;


          var chartNo = this.pats[PatsIndex].chartNo;
          var serno = this.pats[PatsIndex].serno;
          var deleteObj = {};

          var empNo = this.$store.state.loginUser.empNo;
          if(!empNo){
            empNo = 'ORCL';
          }
          this.myPats.forEach(function (myPatObj) {
            if(myPatObj['chartNo'] == chartNo && myPatObj['serno'] == serno){
              deleteObj.chartNo = myPatObj['chartNo'];
              deleteObj.empNo = empNo;
              deleteObj.serno = myPatObj['serno'];
              deleteObj.rawPk = myPatObj['rawPk'];
            }
          })

          if(deleteObj != {}){
            let url = "/iNursingSrv/rest/mypatient/s/" + deleteObj.rawPk;
            this.$http.delete(url)
              .then(response =>{
                //console.log(response.data);
                if(response.data.status == "INFO"){
                  let snackObj ={
                    status:true,
                    text:response.data.message ,
                    timeout:4000,
                    closeText:''
                  };
                  this.$store.commit('setSnackBar',snackObj);

                  this.pats[PatsIndex].isMyPatient = "N"
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
                console.log("delFromMyPat: error : " + error);
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

            //console.log(deleteObj)
          }
          this.confirmDialog = false;

          //alert('刪除功能未完成');
        },iniData:function () {
            this.pats=[];
            this.stations=[];
            this.doctors =[];
            this.filter_vs='';
            this.filter_ns='';
        }

      }
    }
</script>

<style scoped>

.fix-height-1{
  min-height: 550px;
  max-height: 550px;
  overflow-y: auto;
}

.fix-tbody .table{
  min-height: 610px;
  max-height: 610px;
  overflow-y: auto;
}

</style>
