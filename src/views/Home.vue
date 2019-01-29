<template>
  <div>
    <v-container grid-list-md>
      <v-layout justify-center row wrap fill-height>
        <v-flex md12>
          <span class="title">波形显示</span>
        </v-flex>
        <v-flex md12>
          <Spectra></Spectra>
        </v-flex>
        <!-- <v-flex md12>
          <RandomChart></RandomChart>
        </v-flex> -->
      </v-layout>
    </v-container>
    <v-speed-dial v-model="fab" bottom right>
      <v-btn slot="activator" v-model="fab" dark fab color="pink">
        <v-icon>add</v-icon>
        <v-icon>close</v-icon>
      </v-btn>
      <v-btn fab dark small color="green">
        <v-icon>edit</v-icon>
      </v-btn>
      <v-btn fab dark small color="red">
        <v-icon>delete</v-icon>
      </v-btn>
    </v-speed-dial>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ToolBox from '@/components/ToolBox.vue';
import Spectra from '@/components/Spectra.vue';
import RandomChart from '@/components/RandomChart.vue';

@Component({
  components: {
    ToolBox,
    Spectra,
    RandomChart,
  },
  data() {
    return {
      fab: false,
    }
  }
})
export default class Home extends Vue {}
</script>

<style>
.v-speed-dial {
  position: absolute;
}
.v-btn-floating {
  position: relative;
}
</style>
