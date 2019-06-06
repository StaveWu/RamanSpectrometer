<template>
  <v-snackbar v-model="snackbar" right bottom :color="color" :timeout="5000">
    {{ message }}
    <v-btn dark flat @click="snackbar = false">Close</v-btn>
  </v-snackbar>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';

@Component
export default class Log extends Vue {
  color: string = 'info';
  message: string = '';
  snackbar: boolean = false;

  info(message: string) {
    this.open('info', message);
  }

  error(message: string) {
    this.open('error', message);
  }

  success(message: string) {
    this.open('success', message);
  }

  private open(color: string, message: string) {
    this.color = color;
    this.message = message;
    this.snackbar = true;
  }
}
</script>

