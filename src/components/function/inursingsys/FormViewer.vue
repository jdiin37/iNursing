<template>


    <v-layout row class="back"> <!-- Left Menu -->

      <v-flex xs3 sm3 md3 class="div-left" hidden-sm-only v-if="memuStatus">

        <v-toolbar color="primary" height="40" dark>

          <!--<v-toolbar-side-icon @click.stop="memuStatus = false"></v-toolbar-side-icon> -->

          <v-toolbar-title>表單類別</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-switch v-model="showAllGroup" v-show="this.$store.state.loginUser.empNo=='ORCL'"></v-switch>
        </v-toolbar>
          <v-radio-group v-model="formKindSelect" column>
            <v-radio color="primary" class="formKindRadio"
             v-for="item in resultSetFormKindL1"
             :key="item.rawPk"
             :label="item.formTitle"
             :value="item.formType" v-if="item.formType == ((o_propsformtype !== '') ?  o_propsformtype : item.formType)"
             v-on:change="onChangeL1(item.formType, item.formTitle)">
            </v-radio>
          </v-radio-group>

          <!-- <v-flex xs12 sm6 offset-sm3> -->

          <v-card  class="div-left">
            <v-toolbar color="primary" dark height="40">
              <v-toolbar-title>{{selectFormTitle}}</v-toolbar-title>
            </v-toolbar>
            <v-list  class="div-left"  >
              <v-list-group  class="div-left"
                  v-for="item in resultSetFormKindL2"
                  :key="item.rawPk"
                  no-action>
                  <!-- one level-->
                <v-list-tile slot="activator">
                  <v-list-tile-content>
                    <v-list-tile-title>{{ item.formTitle }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <!-- two level -->
                <v-list-tile v-for="subItem in item.formlists" :key="subItem.rawPk" @click="onSelect(subItem.rawPk, subItem.formCode, subItem.formVersion, subItem.formTitle)">
                  <v-list-tile-content>
                    <v-list-tile-title>{{ subItem.formTitle }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>

              </v-list-group>
            </v-list>
          </v-card>
      </v-flex>

      <v-flex xs9 sm9 md9>
        <!-- v-html的內容含有{{ }} 等，無法解析-->
        <!-- <v-icon @click="memuStatus=true" v-if="!memuStatus">menu</v-icon> -->
        <v-btn  dark fab small fixed color="accent" @click="onAdd()">
          <v-icon>add</v-icon>
        </v-btn>
        <div id="formContent" class="formcss" v-html="formContentDecode">

        </div>
        <!--<html-content :htmlcontext="formContentDecode"></html-content>-->
      </v-flex>
    </v-layout>


</template>

<script>
    export default {
        name: "FormViewer",
        props:['propsformtype'],
        data() {
          return {
            message : "Hello !!",
            formKindSelect: "",
            resultSetFormKindL1:"",
            resultSetFormKindL2:"",
            selectFormKind:"",
            selectFormTitle:"",
            resultSetFormList:"",
            formContentDecode:'<h2>{{FD.HOSP_NAME}}</h2>',
            FD:{"HOSP_NAME":"AAAA"},
            LD:{},
            memuStatus:true,
            addForm: {
              addRawKey:'',
              addTitle:'',
              addFormCode:'',
              addFormVersion:''
            },
            showAllGroup:false,
            o_propsformtype:''
          }
        },
        watch: {
          showAllGroup:function(){
            //console.log("watch showAllGroup = " + this.showAllGroup);
            if (this.showAllGroup==true) {
              this.o_propsformtype = '';
            } else {
              this.o_propsformtype = this.propsformtype;
            }
          }
        },
        created: function () {
          this.o_propsformtype = this.propsformtype;
          //window.location.href = "http://172.16.2.33:8080/iFormSys/form-template/AD00_v100.html";
          console.log("FormViewer2- props:" + this.propsformtype);

          let url = "/iFormSys/rest/formkind";
          console.log("ben get L1 url : " + url);
          this.$http.get(url)
            .then(response =>{
              this.resultSetFormKindL1 = response.data.resultSet;
              console.log("get formkind : " + this.resultSetFormKindL1[0].formTitle);
              //------------------
              //this.formKindSelect =  this.propsformtype;
              //------------------
            })
            .catch(error =>  {
              console.log("formmenu: error : " + error)
            });
        },
        methods : {
          onChangeL1: function(formKind, title){
            this.selectFormKind=formKind;
            this.selectFormTitle=title;
            let url = "/iFormSys/rest/formkind/" +formKind + "/all";
            console.log("ben get L2 url : " + url);
            this.$http.get(url)
              .then(response =>{
                this.resultSetFormKindL2 = response.data.resultSet;
                console.log("ben get result(formselect.vue:onChangeL1) : " + this.fesultSetFormKindL2);

              })
              .catch(error =>  {
                console.log(error);
              });
          },
          onSelect: function(rawPk, formCode, formVersion, formTitle) {
              //--- for event ----
              this.addForm.addRawKey = rawPk;
              this.addForm.addFormCode = formCode;
              this.addForm.addFormVersion = formVersion;
              this.addForm.addTitle = formTitle;
              //----- get html ------
              let url = "/iFormSys/rest/formlist/" +formCode+ "/" + formVersion;
              this.$http.get(url)
                .then(response =>{
                  this.resultSetFormList= response.data.resultSet[0];
                  this.formContentDecode = decodeURIComponent(escape(window.atob(this.resultSetFormList.formContent)));
                  //console.log("ben onSelect : " + this.resultSetFormList.formContent);
                  //document.getElementById("formContent").innerHTML = this.formContentDecode;

                })
                .catch(error =>  {
                  console.log(error);
                });
              //---------------------get html end

          },
          onAdd: function() {
            //alert("Add report " + this.addForm.addRawKey);
            this.$emit('addform', this.addForm)
          }
        } //----- method end
    }
//    import Vue from 'vue'
//
//    Vue.component('html-content', {
//      props: ['htmlcontext'],
//      data: function () {
//        return {
//          count: 20
//        }
//      },
//      template: '<p v-html="htmlcontext"></p>'
//    });
</script>

<style scoped>
  * {
    padding: 5px;
  }
  .back {

    background-color:rgba(0, 0, 0, 0.1);
    background-size: cover;

    height: 100%;
  }

  .formKindRadio {
    font-weight:bolder;
  }
  .div-left {
    background:rgba(179,102,255,0.3);
    height: auto;
  }
  .div-right {
    background:rgba(0,240,204,0.3);
  }

  .formcss>>> * {
    font-size: 4px;
  }
  .formcss>>> h1, h2, h3{
    margin:0;
    padding:0;
  }
  .formcss>>> .col-obj{
    align-items: left;
  }
  /*-- for table element ---- */
  .formcss>>> .form-table {
    border: 1px solid black;
    border-collapse: collapse;
  }
  .formcss>>> .form-table-append {
    border-top:none;
    border-left: 1px solid black;
    border-right: 1px solid black;
    border-bottom: 1px solid black;
    border-collapse: collapse;
    margin-top: -1px;
  }
  .formcss>>> tr td {
    height: 0px;
    vertical-align:top;
  }

  .formcss>>>  .div-border {
    border: 0px solid gray;
    padding: 0px;
    margin: 0px auto;
    offset-after: 0px;
    offset-before: 0px;
    height: 40px;
    width: 100%;
    text-align: left;
    vertical-align: middle;
    float: left;
  }
  .formcss>>> .table {
    width:100%;
  }
  .formcss>>> input[readonly] {
    border: 1px;
  }
  .formcss>>> .linefun {
    width:3px;
    visibility: hidden;
  }
</style>
