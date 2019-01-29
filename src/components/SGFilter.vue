<template>
  <v-container>
    <v-layout wrap>
      <v-flex md9>
        <v-slider v-model="order" label="拟合阶数" min="1" max="30" thumb-label></v-slider>
      </v-flex>
      <v-flex md2 offset-md1>
        <v-text-field v-model="order" type="number"></v-text-field>
      </v-flex>
      <v-flex md9>
        <v-slider v-model="windowWidth" label="窗口大小" thumb-label min="1" max="101" step="2"></v-slider>
      </v-flex>
      <v-flex md2 offset-md1>
        <v-text-field v-model="windowWidth" type="number"></v-text-field>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      order: 3,
      windowWidth: 9
    }
  }
})
</script>
