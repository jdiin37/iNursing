<template>
  <v-card >
    <v-flex xs12>
      <v-card  class="white--text">
        <v-container fluid grid-list-lg pa-0>
          <v-layout row>
            <v-flex xs2 pa-1 class="accent">
              <v-btn icon  @click="emitWebCam" ><v-icon>camera_alt</v-icon></v-btn>
            </v-flex>
            <v-flex xs10 pa-0>
              <v-card-media
                :src="patientInfo.pictContent"
                height="186px"
              >
                <v-container fill-height fluid py-2>
                  <v-layout fill-height>
                    <v-flex xs12 sm12 md12 align-end flexbox>
                      <span style="color:SlateBlue">{{patientInfo.ptName}} {{patientInfo.bedNo}}</span>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-media>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
    <!--dev: src="../../static/images/Ben201410.png" 或 build: src="static/images/Ben201410.png" -->
    <v-card-title>
      <div>
        <span class="grey--text">姓別 : {{patientInfo.sex}} -- 年齡 : {{patientInfo.age}} </span><br>
        <span>住院日期 : {{formate_Date(patientInfo.ckinDate)}}  住院天數 {{patientInfo.admitDays}} 天</span><br>
        <span>入院診斷 : {{patientInfo.diagnosisF}} </span>
      </div>

    </v-card-title>
    <v-card-actions>
      <v-btn flat color="green">詳細</v-btn>
      <v-btn flat color="orange">過敏史</v-btn>
      <v-btn flat color="purple">其他</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import * as CommonJs from "@/js/common.js";

  export default {
        name: "PatientCard1",
        computed : {
          patientInfo() {
            return this.$store.state.patientInfo;
          }
      },methods:{
        formate_Date:function(item){
          return CommonJs.formatDateTime(item);
        },
        emitWebCam(){
          this.$emit('showWebCam','');
        }
      }
    }
</script>

<style scoped>

</style>
