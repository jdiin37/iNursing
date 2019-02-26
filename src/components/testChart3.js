import { Line,mixins } from 'vue-chartjs'
import chart_datalabels from 'chartjs-plugin-datalabels'
//import chart_zoom from 'chartjs-plugin-zoom'

const { reactiveProp } = mixins;
export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ['options'],
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
}
