<template>
  <div class="small">
    <line-chart :chart-data="datacollection" :options="chartOptions"></line-chart>
    <button @click="fillData()">Randomize</button>
  </div>
</template>

<script>
  import LineChart from './LineChart.js'

  export default {
    components: {
      LineChart
    },
    chartOptions: {
      responsive: false,
      elements: {
        tension: 0,
      }
    },
    data () {
      return {
        datacollection: null
      }
    },
    mounted () {
      this.fillData()
    },
    methods: {
      fillData () {
        this.datacollection = {
          labels: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt()],
          datasets: [
            {
              label: 'Data One',
              borderColor: '#f87979',
              data: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt()],
              fill: false,
            }
          ]
        }
      },
      getRandomInt () {
        return Math.floor(Math.random() * (50 - 5 + 1)) + 5
      }
    }
  }
</script>

<style>
.small {
  max-width: 600px;
}
</style>