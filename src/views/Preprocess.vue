<template>
  <div>
    <v-toolbar :class="{'white': !dark, 'grey': dark, 'darken-3': dark}" tabs flat>
      <v-btn icon @click="undo()">
        <v-icon>undo</v-icon>
      </v-btn>

      <template v-slot:extension>
        <v-tabs
          centered
          v-model="active"
        >
          <v-tab v-for="i in tabNames.length" :key="i-1">
            {{ tabNames[i - 1] }}
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <v-tabs-items v-model="active">
      <v-tab-item :key="1">
        <conventional-setting/>
      </v-tab-item>
      <v-tab-item :key="2">
        <denoise-setting/>
      </v-tab-item>
      <v-tab-item :key="3">
        <debackground-setting></debackground-setting>
      </v-tab-item>
      <v-tab-item :key="4">
        <detect-setting></detect-setting>
      </v-tab-item>
    </v-tabs-items>

    <v-container fluid>
      <v-layout wrap>
        <v-flex pb-2 xs12>
          <h3>波形显示</h3>
        </v-flex>

        <v-flex xs12>
          <v-card>
            <v-responsive :aspect-ratio="16/9">
              <spectrum :datas="spectraDeque"></spectrum>
            </v-responsive>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import DenoiseSetting from '@/components/DenoiseSetting.vue';
import DebackgroundSetting from '@/components/DebackgroundSetting.vue';
import DetectSetting from '@/components/DetectSetting.vue';
import ConventionalSetting from '@/components/ConventionalSetting.vue';
import Spectrum from '@/components/Spectrum.vue';

import { Component, Prop, Watch } from "vue-property-decorator";

@Component({
  components: {
    DenoiseSetting,
    DebackgroundSetting,
    DetectSetting,
    Spectrum,
    ConventionalSetting
  }
})
export default class PreprocessView extends Vue {
  active: number = 0;
  readonly tabNames: Array<string> = ['常规处理', '光谱去噪', '基线校正', '组分识别'];

  get dark() {
    return this.$store.state.dark;
  }

  get spectraDeque() {
    return this.$store.getters.spectra;
  }

  undo() {
    this.$store.commit('undo');
  }
}
</script>
