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
        chart: {
          type: 'line',
          height: window.innerHeight - 200,
          backgroundColor: null,
        },
        title: {
          text: "Raman Spectra",
          style: {
            color: '#A0A0A3',
          },
        },
        yAxis: {
          title: {
            text: "Intensity",
            style: {
              color: '#A0A0A3',
            },
          },
          labels: {
            style: {
              color: '#A0A0A3',
            }
          }
        },
        xAxis: {
          title: {
            text: "Raman shift",
            style: {
              color: '#A0A0A3',
            },
          },
          labels: {
            style: {
              color: '#A0A0A3',
            }
          }
        },
        series: [
          {
            name: '',
            data: null, // sample data
            turboThreshold: 3500,
          }
        ],
        credits: false,
      }
    };
  }, 
  mounted() {
    // adapt spectra card height to window height 
    // so as to keep spectra fulfilling content
    window.addEventListener('resize', () => {
        this.chartOptions.chart.height = window.innerHeight - 200;
    });
    this.$root.$on('onImportingData', (arr) => {
      this.chartOptions.series[0].data = arr;
    });
  }
});
</script>

