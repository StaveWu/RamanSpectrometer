<template>
  <div>
    <v-container grid-list-md>
      <v-layout justify-center row wrap fill-height>
        <v-flex md12 xs12>
          <span class="title">波形显示</span>
        </v-flex>
        <v-flex md12 xs12>
          <Spectra></Spectra>
        </v-flex>
      </v-layout>
    </v-container>
    <v-speed-dial v-model="fab" bottom right>
      <v-btn slot="activator" v-model="fab" dark fab color="pink">
        <v-icon>add</v-icon>
        <v-icon>close</v-icon>
      </v-btn>
      <v-btn fab dark small color="green" @click="importDataFromFile()">
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
import {remote} from 'electron';
import fs from 'fs';

@Component({
  components: {
    ToolBox,
    Spectra,
  },
  data() {
    return {
      fab: false,
    }
  }
})
export default class Home extends Vue {
  importDataFromFile() {
    const selectedFilePaths = remote.dialog.showOpenDialog({properties: ['openFile']});
    if (selectedFilePaths === undefined) {
      return;
    } else {
      fs.readFile(selectedFilePaths[0], (err, data) => {
        if (err) {
          return console.error(err);
        } else {
          let arr = Array();
          data.toString().trim().split('\n').map(line => arr.push(parseFloat(line.split('\t')[1])));
          this.$root.$emit('onImportingData', arr);
        }
      })
    }
  }
}
</script>

<style>
.v-speed-dial {
  position: absolute;
}
.v-btn-floating {
  position: relative;
}
</style>
