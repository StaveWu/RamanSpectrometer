<template>
  <div>
    <h3 class="pb-2">参数设置</h3>
    <v-card>
      <v-container fluid>
        <v-layout wrap>
          <v-flex xs5 sm5>
            <v-text-field v-model="lambda" type="number" label="平滑系数"></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {Watch, Model, Emit} from 'vue-property-decorator';

@Component
export default class AIRPLS extends Vue {
  lambda: number;
  
  @Model('paramsChanged')
  params!: any;

  constructor() {
    super();
    this.lambda = this.params.lambda;
  }

  @Watch('lambda')
  @Emit('paramsChanged')
  updateParameters() {
    return {
      lambda: this.lambda
    }
  }
}
</script>
