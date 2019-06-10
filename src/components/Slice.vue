<template>
  <div>
    <h3 class="pb-2">参数设置</h3>
    <v-card>
      <v-container fluid>
        <v-layout wrap>
          <v-flex
            shrink
            style="width: 60px"
          >
            <v-text-field
              v-model="wavenumbersRange[0]"
              class="mt-0"
              hide-details
              single-line
              type="number"
            ></v-text-field>
          </v-flex>

          <v-flex px-3>
            <v-range-slider
              v-model="wavenumbersRange"
              :max="3000"
              :min="0"
              :step="1"
            ></v-range-slider>
          </v-flex>

          <v-flex
            shrink
            style="width: 60px"
          >
            <v-text-field
              v-model="wavenumbersRange[1]"
              class="mt-0"
              hide-details
              single-line
              type="number"
            ></v-text-field>
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
export default class Slice extends Vue {
  wavenumbersRange: number[];

  constructor() {
    super();
    this.wavenumbersRange = this.params.wavenumbersRange;
  }

  @Model('paramsChanged')
  params!: any;

  @Watch('wavenumbersRange')
  @Emit('paramsChanged')
  updateParams() {
    return {
      wavenumbersRange: this.wavenumbersRange
    };
  }

}
</script>
