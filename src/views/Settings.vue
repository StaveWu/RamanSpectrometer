<template>
  <div>
    <v-container fluid>
      <v-layout wrap>
        <v-flex xs12>
          <h3>主题设置</h3>
        </v-flex>
        <v-flex xs12 pb-4>
          <v-switch v-model="dark" color="primary" label="白-黑" persistent-hint></v-switch>
        </v-flex>

        <v-flex xs12>
          <h3>关于拉曼光谱识别软件</h3>
        </v-flex>
        <v-flex xs12>
          <v-subheader>当前版本：{{ version }}</v-subheader>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import electron from 'electron'

@Component
export default class Settings extends Vue {
  dark: boolean = this.$store.state.dark;
  version: string = (electron.app || electron.remote.app).getVersion();

  @Watch('dark')
  switchTheme() {
    this.$store.commit('setDark', this.dark);
  }
}
</script>
