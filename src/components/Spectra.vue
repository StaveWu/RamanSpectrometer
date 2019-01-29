<template>
  <v-card>
    <highcharts :options="chartOptions"></highcharts>
  </v-card>
</template>

<script>
import { Chart } from "highcharts-vue";
import Vue from "vue";
export default Vue.extend({
  components: {
    highcharts: Chart
  },
  data() {
    return {
      chartOptions: {
        title: {
          text: "Raman Spectra"
        },
        yAxis: {
          title: {
            text: "Intensity"
          }
        },
        xAxis: {
          title: {
            text: "Raman shift"
          }
        },
        series: [
          {
            data: [1, 2, 3] // sample data
          }
        ],
        credits: false
      }
    };
  }
});
</script>

