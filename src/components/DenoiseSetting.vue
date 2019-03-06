<template>
  <v-container fluid>
    <v-layout wrap>
      <v-flex shrink text-xs-left>
        <v-combobox v-model="selected" :items="items" chips label="请选择去噪算法"></v-combobox>
      </v-flex>
      <v-flex grow text-xs-right>
        <v-btn color="primary" @click="denoise()">应用</v-btn>
        <v-btn color="primary">确认</v-btn>
        <v-btn color="primary">取消</v-btn>
      </v-flex>
      <v-flex md12 xs12>
        <sg-filter v-if="isSG()"></sg-filter>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import SGFilter from '@/components/SGFilter.vue'
export default Vue.extend({
  components: {
    'sg-filter': SGFilter,
  }, 
  data() {
    return {
      selected: 'S-G滤波',
      items: ['S-G滤波', '小波变换', '去噪自编码器']
    }
  }, 
  methods: {
    isSG() {
      return this.selected === 'S-G滤波';
    },
    denoise() {
      // denoise spectra
      console.log('denoise..')
    }
  }
})
</script>

<style>
.div-left {
  float: left;
}

.div-right {
  float: right;
}
</style>


