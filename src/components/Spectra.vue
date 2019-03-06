<template>
    <v-card>
      <div id="container" style="width: 600px;height:400px;"></div>
    </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import * as Highcharts from 'highcharts';
import Component from "vue-class-component";

@Component
export default class Spectra extends Vue {
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'line',
      backgroundColor: undefined
    },
    title: {
      text: "Raman Spectra"
    },
    xAxis: {
      title: {
        text: 'Raman shift'
      }
    },
    yAxis: {
      title: {
        text: 'Intensity'
      }
    },
    credits: {
      enabled: false
    }
  };
  mounted() {
    let chart = Highcharts.chart('container', this.chartOptions);
    chart.addSeries({
      type: 'line', // in ts this property must be assigned
      name: 'test',
      data: new Array<number>(1, 2, 3, 2)
    })
  }
}
</script>


