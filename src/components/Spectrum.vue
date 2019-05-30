<template>
    <div class="highcharts" :id="container"></div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as Highcharts from 'highcharts';
import { Component, Prop, Watch } from "vue-property-decorator";
import {SpectrumDO} from '@/utils'

@Component
export default class Spectrum extends Vue {
  @Prop({
    default: ""
  }) 
  title!: string;

  @Prop({
    default: () => new Array<SpectrumDO>()
  })
  datas!: Array<SpectrumDO>;

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

  @Watch('datas', {deep: true})
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
          text: 'Wavenumbers/cm-1'
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
    let diff = this.chart.series.length - this.datas.length;
    if (diff > 0) {
      for (let i = this.chart.series.length; i > this.datas.length; i--) {
        this.chart.series[i-1].remove(true);
      }
    } else if (diff < 0) {
      for (let i = this.chart.series.length; i < this.datas.length; i++) {
        this.chart.addSeries(<Highcharts.SeriesLineOptions>{});
      }
    }
    // update
    for (let i = 0; i < this.datas.length; i++) {
      this.chart.series[i].update(<Highcharts.SeriesLineOptions>{
        name: this.datas[i].name,
        data: this.datas[i].data
      });
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

