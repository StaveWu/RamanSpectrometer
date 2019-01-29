<template>
  <div>
    <v-tabs>
      <v-tab :key="1">
        光谱去噪
      </v-tab>
      <v-tab-item :key="1">
        <denoise-setting></denoise-setting>
      </v-tab-item>
      <v-tab :key="2">
        基线校正
      </v-tab>
      <v-tab-item :key="2">
      </v-tab-item>
      <v-tab :key="3">
        组分识别
      </v-tab>
      <v-tab-item :key="3">
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import DenoiseSetting from '@/components/DenoiseSetting.vue';
export default Vue.extend({
  components: {
    DenoiseSetting,
  }
})
</script>


