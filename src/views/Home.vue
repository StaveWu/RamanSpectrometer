<template>
  <div>
    <v-container>
      <v-layout wrap>
        <v-flex xs12 pb-2>
          <h2>导入</h2>
        </v-flex>
        <v-flex xs12 text-xs-left>
          <v-btn color="primary" @click="importSpectraFromFile()">
            <v-icon left dark>cloud_upload</v-icon>
            从本地打开
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
    
    <v-container fluid grid-list-xl>
      <v-layout row wrap>
        <v-flex xs12 pb-2>
          <h2>最近</h2>
        </v-flex>

        <v-flex
          v-for="i in numRecentSpectras"
          :key="i"
          xs12 sm6 md4 lg4 xl4>
          <v-hover>
            <v-card 
              slot-scope="{ hover }" 
              :class="`elevation-${hover ? 12 : 2}`" 
              @click="openSpectra(i - 1)" 
              to="/preprocess">
              <v-responsive :aspect-ratio="4/3">
                <spectrum :title="title" :data="spectras[i - 1]"></spectrum>
              </v-responsive>
            </v-card>
          </v-hover>
        </v-flex>
      </v-layout>
    </v-container>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import Spectrum from '@/components/Spectrum.vue';
import {remote} from 'electron';
import fs from 'fs';

@Component({
  components: {
    Spectrum
  }
})
export default class Home extends Vue {
  numRecentSpectras: number;
  spectras: Array<Array<number>>;
  title: string = 'hello';

  constructor() {
    super();
    this.spectras = [[1, 2, 4, 8], [3, 2, 5, 7], [4, 9, 2, 1], [3, 2, 1, 3], [3, 2, 7, 3]];
    this.numRecentSpectras = this.spectras.length;
  }

  openSpectra(i: number) {
    this.postData(this.spectras[i]);
  }

  importSpectraFromFile() {
    const selectedFilePaths = remote.dialog.showOpenDialog({properties: ['openFile']});
    if (selectedFilePaths === undefined) {
      return;
    } else {
      fs.readFile(selectedFilePaths[0], (err, data) => {
        if (err) {
          return console.error(err);
        } else {
          let arr = new Array<number>();
          data.toString().trim().split('\n').map(line => arr.push(parseFloat(line.split('\t')[1])));
          this.postData(arr);
          this.$router.push('/preprocess');
        }
      })
    }
  }

  private postData(data: Array<number>) {
    // post data by global attribute of vue.
    Vue.prototype.spectraData = data;
  }
}
</script>
