<template>
  <div>
    <v-btn @click="getOneLevel" color="success" >One</v-btn>
    <v-btn @click="getTwoLevel" color="warning">Two</v-btn>
    <v-btn @click="getThreeLevel" color="error">Three</v-btn>
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex xs1 offset-xs4>
          <v-card dark color="purple">
            <v-card-text>案件數</v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs1>
          <v-card dark color="purple">
            <v-card-text>比率</v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs1>
          <v-card dark color="purple">
            <v-card-text>醫療費用(A)</v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs1>
          <v-card dark color="purple">
            <v-card-text>申請費用(B)</v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs1>
          <v-card dark color="purple">
            <v-card-text>價差(C=B-A)</v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs1>
          <v-card dark color="purple">
            <v-card-text>價差率(C/B)</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout row v-for="(item, index) in displayData">
        <v-flex xs1 v-if="item['level'] == '1'">
          <v-card dark >
            <v-card-text>{{item['code']}}</v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs3 v-if="item['level'] == '1'">
          <v-card dark >
            <v-card-text>{{item['name']}}</v-card-text>
          </v-card>
        </v-flex>
        <v-flex offset-xs1 xs1 v-if="item['level'] == '2'">
          <v-card dark >
            <v-card-text>{{item['code']}}</v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs2 v-if="item['level'] == '2'">
          <v-card dark >
            <v-card-text>{{item['name']}}</v-card-text>
          </v-card>
        </v-flex>
        <v-flex offset-xs2 xs1 v-if="item['level'] == '3'">
          <v-card dark >
            <v-card-text>{{item['code']}}</v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs1 v-if="item['level'] == '3'">
          <v-card dark >
            <v-card-text>{{item['name']}}</v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs1 >
          <v-card  >
            <v-card-text>{{item['counts']}}</v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs1 >
          <v-card  >
            <v-card-text>{{item['ratio']}}</v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs1 >
          <v-card  >
            <v-card-text>{{item['cost']}}</v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs1 >
          <v-card  >
            <v-card-text>{{item['apply']}}</v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs1 >
          <v-card  >
            <v-card-text>{{item['part']}}</v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs1 >
          <v-card  >
            <v-card-text>{{item['diff_ratio']}}</v-card-text>
          </v-card>
        </v-flex>

      </v-layout>

    </v-container>
    <!--<ul>-->
      <!--<li v-for="(item, index) in dataArr">-->
        <!--item: {{item[level1keys[0]]}} , {{item[level1keys[1]]}} , {{item['counts']}}, {{item['ratio']}}, {{item['cost']}}, {{item['apply']}}, {{item['part']}}, {{item['diff_ratio']}}-->
        <!--<ul v-if= "item['level2'] != null">-->
          <!--<li v-for="(item2, index2) in item['level2']">-->
            <!--item:{{item2[level2keys[0]] , item2[level2keys[1]]}},{{item2['counts']}}, {{item2['ratio']}}, {{item2['cost']}}, {{item2['apply']}}, {{item2['part']}}, {{item2['diff_ratio']}}-->
            <!--<ul v-if ="item2['level3'] != null">-->
              <!--<li v-for="(item3, index3) in item2['level3']">-->
                <!--item:{{item3[level3keys[0]]}}, {{item3[level3keys[1]]}}, {{item3['counts']}}, {{item3['ratio']}}, {{item3['cost']}}, {{item3['apply']}}, {{item3['part']}}, {{item3['diff_ratio']}}-->
              <!--</li>-->
            <!--</ul>-->
          <!--</li>-->
        <!--</ul>-->
      <!--</li>-->
    <!--</ul>-->
  </div>
</template>

<script>
    export default {
        name: "Kobe",
        data(){
          return{
            dataArr:[],
            level1keys:['mdc_code','mdc_name'],
            level2keys:['drg_code','drg_name'],
            level3keys:['d9','div_name'],
            displayData:[]
          }
        },
      watch: {
        dataArr: function (newdata, olddata) {
          var displayData = [];
          var level1keys = this.level1keys;
          var level2keys = this.level2keys;
          var level3keys = this.level3keys;
          newdata.forEach(function (item){
            var rowObj = {
              'code':item[level1keys[0]],
              'name':item[level1keys[1]] + '名稱',
              'counts':item['counts'],
              'ratio':item['ratio'],
              'cost':item['cost'],
              'apply':item['apply'],
              'part':item['part'],
              'diff_ratio':item['diff_ratio'],
              'level':'1'
            }

            displayData.push(rowObj);

            if(item.level2 != null){
              item.level2.forEach(function(item2){
                var rowObj = {
                  'code':item2[level2keys[0]],
                  'name':item2[level2keys[1]]+ '名稱',
                  'counts':item2['counts'],
                  'ratio':item2['ratio'],
                  'cost':item2['cost'],
                  'apply':item2['apply'],
                  'part':item2['part'],
                  'diff_ratio':item2['diff_ratio'],
                  'level':'2'
                }
                displayData.push(rowObj);
                if(item2.level3 != null){
                  item2.level3.forEach(function(item3){
                    var rowObj = {
                      'code':item3[level3keys[0]],
                      'name':item3[level3keys[1]]+ '名稱',
                      'counts':item3['counts'],
                      'ratio':item3['ratio'],
                      'cost':item3['cost'],
                      'apply':item3['apply'],
                      'part':item3['part'],
                      'diff_ratio':item3['diff_ratio'],
                      'level':'3'
                    }
                    displayData.push(rowObj);
                  })
                }
              })
            }
          });

          this.displayData = displayData;
          console.log(this.displayData)
        }

      },
      methods:{
          getOneLevel:function(){
            this.$http.get('http://localhost:8085/static/conf/mdc.txt').then(response =>{
              this.dataArr =response.data.resultSet;
              console.log(this.dataArr)

            })
              .catch(error =>  {
                console.log(" error : " + error);
              });
          },
          getTwoLevel:function(){
            this.$http.get('http://localhost:8085/static/conf/mdc_drg.txt').then(response =>{
              this.dataArr =response.data.resultSet;
              console.log(this.dataArr)

            })
              .catch(error =>  {
                console.log(" error : " + error);
              });
          },
          getThreeLevel:function(){
            this.$http.get('http://localhost:8085/static/conf/mdc_drg_div.txt').then(response =>{
              this.dataArr =response.data.resultSet;
              console.log(this.dataArr)

            })
              .catch(error =>  {
                console.log(" error : " + error);
              });
          },
      }
    }
</script>

<style scoped>

</style>
