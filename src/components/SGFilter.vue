<template>
  <v-card>
    <v-container fluid>
      <v-layout wrap>
        <v-flex lg4 md4 xs10 sm4>
          <v-slider v-model="order" label="拟合阶数" min="1" max="30" thumb-label></v-slider>
        </v-flex>
        <v-flex lg1 md1 xs2 sm1 pl-3>
          <v-text-field v-model="order" type="number"></v-text-field>
        </v-flex>

        <v-flex lg4 md4 xs10 sm4 offset-md1 offset-sm1 offset-lg1>
          <v-slider v-model="windowLength" label="窗口大小" thumb-label min="1" max="101" step="2"></v-slider>
        </v-flex>
        <v-flex lg1 md1 xs2 sm1 pl-3>
          <v-text-field v-model="windowLength" type="number"></v-text-field>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
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
