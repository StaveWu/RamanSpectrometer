<template>
    <div class="highcharts" :id="container"></div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as Highcharts from 'highcharts';
import { Component, Prop, Watch } from "vue-property-decorator";
import {Series} from '@/utils'

@Component
export default class Spectrum extends Vue {
  @Prop({
    default: ""
  }) 
  title!: string;

  @Prop({
    default: () => new Array<Series>()
  })
  datas!: Array<Series>;

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
    this.reloadTitle();
  }

  @Watch('datas')
  updateDatas() {
    this.reloadDatas();
  }

  mounted() {
    this.chart = new Highcharts.Chart(this.container, {
      chart: {
        type: 'line',
        backgroundColor: undefined,
      },
      xAxis: {
        title: {
          text: 'Wavenumbers'
        },
        gridLineWidth: 1
      },
      yAxis: {
        title: {
          text: 'Intensity'
        },
      },
      credits: {
        enabled: false
      }
    });
    
    this.reloadDatas();
    this.reloadTitle();
  }

  private reloadDatas() {
    if (!this.checkChart()) {
      return;
    }

    // 这里不能清掉再添加，因为对性能有影响，画面会有残留；
    // 猜测与series的大小被重新分配有关，内部定义series有一定的开销
    let seriesLength = this.chart.series.length;
    for (let i = 0; i < this.datas.length; i++) {
      if (i < seriesLength) {
        this.chart.series[i].name = this.datas[i].name;
        this.chart.series[i].setData(this.datas[i].data);
      } else {
        this.chart.addSeries(<Highcharts.SeriesLineOptions>{
          data: this.datas[i].data,
          name: this.datas[i].name,
        });
      }
    }
  }

  private reloadTitle() {
    if (!this.checkChart()) {
      return;
    }
    this.chart.title.update({text: this.title});
  }

  private checkChart(): boolean {
    if (this.chart === undefined) {
      alert('表格没有初始化！');
      return false;
    }
    return true;
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

