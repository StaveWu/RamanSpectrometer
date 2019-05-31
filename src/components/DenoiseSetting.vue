<template>
  <v-container fluid>
    <v-layout wrap>
      <v-flex text-xs-left md12 xs12 lg12>
        <v-combobox v-model="selected" :items="items" chips label="请选择去噪算法"></v-combobox>
      </v-flex>

      <v-flex xs12>
        <sg-filter v-if="isSG()" v-model="params"></sg-filter>
      </v-flex>

      <v-flex text-xs-right pt-3>
        <v-btn color="primary" @click="denoise()">应用</v-btn>
        <v-btn color="primary" @click="confirm()">确定</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import SGFilter from "@/components/SGFilter.vue";
import Component from "vue-class-component";
import { AxiosResponse, AxiosError } from "axios";
import { SpectrumDO } from "@/utils";
import DenoiseRepository from "@/repositories/DenoiseRepository";
import { Algorithm, SG, DAE, WAVELET } from "../common/Algorithm";

@Component({
  components: {
    "sg-filter": SGFilter
  }
})
export default class DenoiseSetting extends Vue {
  selected: Algorithm = SG;
  items: Array<Algorithm> = [SG, WAVELET, DAE];

  params: any = { order: 3, windowLength: 9 };

  isSG() {
    return this.selected === SG;
  }

  denoise() {
    DenoiseRepository.get(
      this.selected.value,
      this.$store.state.targetSpectrum,
      this.params
    )
      .then((response: AxiosResponse) => {
        let spec = SpectrumDO.fromJson(response.data);
        spec.id = this.$store.state.targetSpectrum.id;
        this.$store.commit(
          "setCandidateSpectrum",
          spec
        );
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


