<template>
    <div class="highcharts" :id="container" :title="title" :data="data"></div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as Highcharts from 'highcharts';
import Component from "vue-class-component";

@Component({
    props: [
      'title',
      'data',
    ]
})
export default class Spectrum extends Vue {
  title?: string;
  data?: Array<number>;
  chart?: Highcharts.Chart;
  container: string;
  static id: number = 0;

  constructor() {
    super();
    Spectrum.id++;
    this.container = 'container' + Spectrum.id;
  }

  mounted() {
    this.chart = new Highcharts.Chart(this.container, {
      chart: {
        type: 'line',
        backgroundColor: undefined
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
    });

    this.chart.addSeries(<Highcharts.SeriesLineOptions>{
      data: this.data
    })
    this.chart.title.update({text: this.title});
  }
}
</script>

<style>
.highcharts {
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>

