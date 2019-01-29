<template>
  <v-container>
    <v-layout wrap>
      <v-flex md12>
        <v-combobox v-model="selected" :items="items" chips label="请选择去噪算法"></v-combobox>
      </v-flex>
      <v-flex md12>
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
    }
  }
})
</script>

