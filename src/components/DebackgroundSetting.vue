<template>
  <v-container fluid>
    <v-layout wrap>
      <v-flex text-xs-left md12 xs12 lg12>
        <v-combobox v-model="selected" :items="items" chips label="请选择基线校正算法"></v-combobox>
      </v-flex>

      <v-flex pb-2 xs12>
        <h3>参数设置</h3>
      </v-flex>
      
      <v-flex text-xs-left md12 xs12 sm12 lg12>
        <v-card>
          <air-pls v-if="isAIRPLS()"></air-pls>
        </v-card>
      </v-flex>

      <v-flex xs12 md12 lg12 text-xs-right pt-3>
        <v-btn color="primary" @click="debackground()">应用</v-btn>
        <v-btn color="primary">确定</v-btn>
        <v-btn color="primary">取消</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import airPLS from '@/components/AIRPLS.vue'


enum DebackgroundAlogrithm {
  AIRPLS = 'airPLS',
  POLYFIT = '多项式拟合'
}

@Component({
  components: {
    'air-pls': airPLS
  }
})
export default class DebackgroundSetting extends Vue {
  selected: DebackgroundAlogrithm = DebackgroundAlogrithm.AIRPLS;
  items: Array<DebackgroundAlogrithm> = [
    DebackgroundAlogrithm.AIRPLS,
    DebackgroundAlogrithm.POLYFIT
  ];
  
  isAIRPLS(): boolean {
    return this.selected === DebackgroundAlogrithm.AIRPLS;
  }
  debackground(): void {
    console.log("debackground...");
  }
}
</script>

