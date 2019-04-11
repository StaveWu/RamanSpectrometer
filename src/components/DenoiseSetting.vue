<template>
  <v-container fluid>
    <v-layout wrap>
      <v-flex text-xs-left md12 xs12 lg12>
        <v-combobox v-model="selected" :items="items" chips label="请选择去噪算法"></v-combobox>
      </v-flex>

      <v-flex pb-2 xs12>
        <h3>参数设置</h3>
      </v-flex>
      
      <v-flex>
        <sg-filter v-if="isSG()"></sg-filter>
      </v-flex>

      <v-flex text-xs-right pt-3>
        <v-btn color="primary" @click="denoise()">应用</v-btn>
        <v-btn color="primary">确定</v-btn>
        <v-btn color="primary">取消</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import SGFilter from '@/components/SGFilter.vue'
import Component from 'vue-class-component';

enum DenoiseAlogrithm {
  SG = 'S-G滤波',
  WAVELET = '小波变换',
  DAE = '去噪自编码器'
}

@Component({
  components: {
    'sg-filter': SGFilter
  }
})
export default class DenoiseSetting extends Vue {
  selected: DenoiseAlogrithm = DenoiseAlogrithm.SG;
  items: Array<DenoiseAlogrithm> = [
    DenoiseAlogrithm.SG, 
    DenoiseAlogrithm.WAVELET, 
    DenoiseAlogrithm.DAE
  ];
  
  isSG(): boolean {
    return this.selected === DenoiseAlogrithm.SG;
  }
  denoise(): void {
    console.log("denoise...");
  }
}
</script>

<style>
.div-left {
  float: left;
}

.div-right {
  float: right;
}
</style>


