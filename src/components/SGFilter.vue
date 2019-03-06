<template>
  <v-container>
    <v-layout wrap>
      <v-flex md4 xs4>
        <v-slider v-model="order" label="拟合阶数" min="1" max="30" thumb-label></v-slider>
      </v-flex>
      <v-flex md1 xs1 pl-2>
        <v-text-field v-model="order" type="number"></v-text-field>
      </v-flex>
      <v-flex md4 xs4 offset-xs1 offset-md1>
        <v-slider v-model="windowLength" label="窗口大小" thumb-label min="1" max="101" step="2"></v-slider>
      </v-flex>
      <v-flex md1 xs1 pl-2>
        <v-text-field v-model="windowLength" type="number"></v-text-field>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';

@Component
export default class SGFilter extends Vue {
  order: number = 3;
  windowLength: number = 9;
}
</script>
