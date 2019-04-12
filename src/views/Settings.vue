<template>
  <div>
    <v-container>
      <v-layout>
        <v-flex>
          <v-switch v-model="dark" color="primary" label="切换主题"></v-switch>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'

@Component
export default class Settings extends Vue {
  dark: boolean = false;

  @Watch('dark')
  switchTheme() {
    Vue.prototype.dark = this.dark;
  }

  mounted() {
    this.dark = this.getDark();
  }

  private getDark() {
    let res = Vue.prototype.dark;
    if (res === undefined) {
      res = false;
    }
    return res;
  }
}
</script>
