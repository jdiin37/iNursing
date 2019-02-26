<template>
  <v-card>
    <!--<v-card-title>-->
      <!--<v-layout row wrap>-->
        <!--<v-flex xs12 md2 px-1>-->
          <!--<v-text-field-->
            <!--append-icon="search"-->
            <!--:append-icon-cb="() => (getMyPat())"-->
            <!--v-model="filter_chartNo"-->
            <!--label="病歷號"-->
            <!--v-on:keyup.enter="getMyPat"-->
          <!--&gt;</v-text-field>-->
        <!--</v-flex>-->
        <!--<v-flex xs12 md2 px-1>-->
          <!--<v-select-->
            <!--:items="doctors"-->
            <!--v-model="filter_vs"-->
            <!--label="醫師"-->
            <!--item-value="value"-->
          <!--&gt;</v-select>-->
        <!--</v-flex>-->
        <!--<v-flex xs12 md2 px-1>-->
          <!--<v-select-->
            <!--:items="stations"-->
            <!--v-model="filter_ns"-->
            <!--label="護理站"-->
            <!--item-value="value"-->
          <!--&gt;</v-select>-->
        <!--</v-flex>-->
      <!--</v-layout>-->
    <!--</v-card-title>-->
    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">移除我的照護病人</v-card-title>
        <v-card-text v-html="deleteContent"></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click.native="deleteDialog = false">取消</v-btn>
          <v-btn color="green darken-1" flat="flat" @click.native="confirmDelete">確定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table
      :headers="headers"
      :items="this.myPats"
      :loading="this.myPatsLoading"
      :pagination.sync="pagination"
      hide-actions
      class="fix-height-1"
    >
      <template slot="items" slot-scope="props">
        <tr @click="selectPT(props.item)">
          <td class="justify-center layout px-0">
            <v-btn icon class="mx-1" @click.stop="delMyPat(props.item)">
              <v-icon color="teal">delete</v-icon>
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
      <template slot="pageText" slot-scope="props">
        第 {{ props.pageStart }} - {{ props.pageStop }} ,共 {{ props.itemsLength }} 筆
      </template>
      <template slot="no-data">
        <v-alert :value='this.myPatsLoading' type="warning">
          資料讀取中, 請稍後...
        </v-alert>
        <v-alert :value='!this.myPatsLoading' color="error" icon="warning">
          對不起, 目前沒有資料:(
        </v-alert>
      </template>
    </v-data-table>
    <v-layout row wrap>
      <v-flex xs12 md8 text-xs-center pt-2>
        <v-pagination v-model="pagination.page" :length="pages" :total-visible="7"></v-pagination>
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
    import patinpInfo from "@/js/PatientInfoFunction.js";

    export default {
        name: "MyPatientList1",
        props: ['myPats','myPatsLoading'],
      data () {
        return {
          pageItem:[
            {text:12,value:12},
            {text:20,value:20},
            {text:'ALL',value:9999},
          ],
          pagination: {
            sortBy: 'chartNo',
            rowsPerPage:12
          },
          pageText:'每頁筆數 :',
          filter_chartNo: '',
          filter_vs:'',
          filter_ns:'',
          stations:[],
          doctors:[],
          deleteDialog:false,
          deleteContent:'',
          deletedIndex:'',
          headers: [
            {
              text: '',
              align: 'center',
              sortable:false,
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
          ]
        }
      },computed: {
        pages () {
          if (this.pagination.rowsPerPage == null ||
            this.pagination.totalItems == null
          ) return 0

          this.pagination.totalItems = this.myPats.length; //20180716 fix vuetify new version bug
          this.pagination.page = 1

          return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
        },
      },watch:{

      },
      mounted:function() {
      },methods:{
        formate_Date:function(item){
          return CommonJs.formatDateTime(item);
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
            age:'',
            diagnosis_F:'',
            pictContent:''
          };
          //------ Get PT Information -------
          //age:'',

          let getPatinpObj = patinpInfo.getPatinpInfo(rowObj.chartNo,rowObj.serno);
          selectPtObj.diagnosis_F = getPatinpObj.diagnosis_F;
          selectPtObj.age = getPatinpObj.age;
          //---------------------------------
          this.$store.commit('selectPt', selectPtObj);

          //-----set Pic---
          this.getPic(rowObj.chartNo);
          //---------
          this.$store.commit('togglePtList');
          this.$router.push('/home/episodesummary');
        },
        delMyPat:function(rowObj){
          const index = this.myPats.indexOf(rowObj);
          //rowObj.rawPk
          var delText = (rowObj.ptName + '('+ rowObj.chartNo +') ');
          this.deleteDialog = true;
          this.deleteContent= delText;
          this.deletedIndex = index;
          //confirm('確定要將 ' + rowObj.ptName + '('+ rowObj.chartNo +') 從我的照護病人中移除嗎?') && this.pats.splice(index, 1)
        },
        confirmDelete:function () {
          var listIndex = this.deletedIndex;
          var deleteObj ={}
          deleteObj.chartNo = this.myPats[listIndex]['chartNo'];
          var empNo = this.$store.state.loginUser.empNo;
          if(!empNo){
            empNo = 'ORCL';
          }
          deleteObj.empNo = empNo;
          deleteObj.serno = this.myPats[listIndex]['serno'];
          deleteObj.rawPk = this.myPats[listIndex]['rawPk'];

          if(deleteObj){
            //console.log(deleteObj)
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

                  this.myPats.splice(listIndex,1);
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
          }

          this.deleteDialog = false;
          //alert('刪除功能未完成')
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
        iniData:function () {
          this.pats=[];
          this.stations=[];
          this.doctors =[];
          this.filter_vs='';
          this.filter_ns='';
          this.filter_chartNo='';
        }
      }
    }
</script>

<style scoped>
.fix-height-1{
  min-height: 656px;
  max-height: 656px;
  overflow-y: auto;
}
</style>
