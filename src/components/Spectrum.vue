<template>
    <div class="highcharts" :id="container"></div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as Highcharts from 'highcharts';
import { Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class Spectrum extends Vue {
  @Prop({
    default: ""
  }) 
  title!: string;

  @Prop({
    default: () => new Array<number>()
  })
  data!: Array<number>;

  chart?: Highcharts.Chart;
  container: string;
  static id: number = 0;

  constructor() {
    super();
    Spectrum.id++;
    this.container = 'container' + Spectrum.id;
  }

  @Watch('title')
  updateTitle() {
    if (this.chart !== undefined)
      this.chart.title.update({text: this.title});
  }

  @Watch('data')
  updateData() {
    if (this.chart !== undefined) {
      this.chart.series[0].setData(this.data);
    }
  }

  mounted() {
    this.chart = new Highcharts.Chart(this.container, {
      chart: {
        type: 'line',
        backgroundColor: undefined
      },
      xAxis: {
        title: {
          text: 'Wavenumbers'
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
    });
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

