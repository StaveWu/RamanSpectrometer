<template>
  <v-card>
    <v-container fluid>
      <v-layout wrap>
        <v-flex xs5 sm5>
          <v-text-field v-model="lambda" type="number" label="平滑系数"></v-text-field>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';

@Component
export default class AIRPLS extends Vue {
  lambda: number = 1e7;
}
</script>
