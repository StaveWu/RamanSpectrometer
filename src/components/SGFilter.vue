<template>
  <div>
    <h3 class="pb-2">参数设置</h3>
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {Watch, Model, Emit, Prop} from 'vue-property-decorator';

@Component
export default class SGFilter extends Vue {
  order: number;
  windowLength: number;

  constructor() {
    super();
    this.order = this.params.order;
    this.windowLength = this.params.windowLength;
  }

  @Model('paramsChanged')
  params!: any;

  @Watch('windowLength')
  @Watch('order')
  @Emit('paramsChanged')
  updateParams() {
    return {
      order: this.order,
      windowLength: this.windowLength
    };
  }

}
</script>
