<template>
  <div>
    <v-tabs centered>
      <v-tab :key="1">光谱去噪</v-tab>
      <v-tab :key="2">基线校正</v-tab>
      <v-tab-item :key="1">
        <denoise-setting/>
      </v-tab-item>
      <v-tab-item :key="2">
        <h3>基线</h3>
      </v-tab-item>
    </v-tabs>
    <v-container fluid>
      <v-layout wrap>
        <v-flex>
          <spectra></spectra>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import DenoiseSetting from '@/components/DenoiseSetting.vue';
import Spectra from '@/components/Spectra.vue';
export default Vue.extend({
  components: {
    DenoiseSetting,
    Spectra
  }
})
</script>
