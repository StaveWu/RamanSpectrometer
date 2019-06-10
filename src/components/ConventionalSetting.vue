<template>
  <v-container fluid>
    <v-layout wrap>
      <v-flex text-xs-left md12 xs12 lg12>
        <v-combobox v-model="selected" :items="items" chips label="请选择常规操作"></v-combobox>
      </v-flex>

      <v-flex xs12>
        <slice v-if="isSlice()" v-model="params"></slice>
      </v-flex>

      <v-flex text-xs-right pt-3>
        <v-btn color="primary" @click="preprocess()">应用</v-btn>
        <v-btn color="primary" @click="confirm()">确定</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { SpectrumDO } from "../models";
import { Algorithm, MINMAX_SCALE, SCALE, SLICE } from "../common/Algorithm";
import ConventionalRepository from "@/repositories/ConventionalRepository";
import Slice from "@/components/Slice.vue";

@Component({
  components: {
    Slice
  }
})
export default class ConventionalSetting extends Vue {
  selected: Algorithm = MINMAX_SCALE;
  items: Array<Algorithm> = [MINMAX_SCALE, SCALE, SLICE];
  params: any = {wavenumbersRange: [0, 3000]};

  preprocess() {
    ConventionalRepository.get(
      this.selected.value,
      this.$store.state.targetSpectrum,
      this.params
    )
      .then((spec: SpectrumDO) => {
        this.$store.commit("setCandidateSpectrum", spec);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  confirm() {
    this.$store.commit("candidateToTarget");
  }

  isSlice() {
    return this.selected === SLICE;
  }
}
</script>
