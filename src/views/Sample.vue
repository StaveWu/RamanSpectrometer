<template>
  <div>
    <v-subheader>导入</v-subheader>
    <v-btn depressed color="primary">
      <v-icon left dark>cloud_upload</v-icon>
      从本地打开
    </v-btn>
    
    <v-subheader>最近</v-subheader>
    <v-container fluid grid-list-xl>
      <v-layout row wrap>
        <v-flex
          v-for="i in numRecentSpectras"
          :key="i"
          xs4 sm4 md4 lg4 xl4>
          <v-card>
            <v-responsive :aspect-ratio="4/3">
              <spectrum title="hello" :data="spectras[i - 1]"></spectrum>
            </v-responsive>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import Spectrum from '@/components/Spectrum.vue';

@Component({
  components: {
    Spectrum
  }
})
export default class Home extends Vue {
  numRecentSpectras?: number;
  spectras?: Array<Array<number>>;
  constructor() {
    super();
    this.spectras = [[1, 2, 4, 8], [3, 2, 5, 7], [4, 9, 2, 1], [3, 2, 1, 3], [3, 2, 7, 3]];
    this.numRecentSpectras = this.spectras.length;
  }
}
</script>
