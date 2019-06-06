<template>
  <v-container fluid>
    <v-layout wrap>
      <v-flex text-xs-left md12 xs12 lg12>
        <v-combobox v-model="selected" :items="items" chips label="请选择基线校正算法"></v-combobox>
      </v-flex>

      <v-flex text-xs-left md12 xs12 sm12 lg12>
        <air-pls v-if="isAIRPLS()" v-model="params"></air-pls>
      </v-flex>

      <v-flex text-xs-right pt-3>
        <v-btn color="primary" @click="debackground()">应用</v-btn>
        <v-btn color="primary" @click="confirm()">确定</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import airPLS from "@/components/AIRPLS.vue";
import { AxiosResponse, AxiosError } from "axios";
import { Algorithm, AIRPLS } from "../common/Algorithm";
import DebackgroundRepository from "../repositories/DebackgroundRepository";
import { SpectrumDO } from "@/models";

@Component({
  components: {
    "air-pls": airPLS
  }
})
export default class DebackgroundSetting extends Vue {
  selected: Algorithm = AIRPLS;
  items: Array<Algorithm> = [AIRPLS];
  params: any = { lambda: 1e4 };

  isAIRPLS() {
    return this.selected === AIRPLS;
  }

  debackground() {
    DebackgroundRepository.get(
      this.selected.value,
      this.$store.state.targetSpectrum,
      this.params
    )
      .then((spec: SpectrumDO) => {
        this.$store.commit("setCandidateSpectrum", spec);
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  }

  confirm() {
    this.$store.commit("candidateToTarget");
  }
}
</script>

