  import Vue from 'vue'
  import {Line,mixins} from 'vue-chartjs'
  const { reactiveProp } = mixins  //reactiveProp
  import VueChartDataLabels from 'chartjs-plugin-datalabels'
  // import {reactiveProp} from "vue-chartjs/es/mixins/index";
  Vue.use(VueChartDataLabels);
  export default {
    extends: Line,
    mixins: [reactiveProp],
    props: ['chartData','options'],
    name: "VueLineChart",
    mounted(){
      this.renderChart(this.chartData,this.options)
    }
  }
   // export default Line.extend({
   //   mixins: [reactiveProp],
   //   props: ['data','options'],
   //   name: "VueLineChart",
   //   mounted(){
   //     this.renderChart(this.data,this.options)
   //   }
   // })


