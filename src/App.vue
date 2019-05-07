<template>
  <v-app class="global" :dark="dark">
    <v-navigation-drawer clipped app width="170" :class="{'grey': !dark, 'lighten-3': !dark}" permanent floating>
      <v-container>
        <v-layout text-xs-center wrap>
          <v-flex xs12>
            <v-img
              :src="require('./assets/logo.svg')"
              class="my-1"
              contain
              height="50"
            ></v-img>
          </v-flex>
          <v-flex xs12>
            <h3>拉曼光谱识别</h3>
          </v-flex>
        </v-layout>
      </v-container>

      <v-list dense>
        <v-list-tile
          v-for="item in items"
          :key="item.title"
          :to="item.to"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-content>
        <router-view></router-view>
    </v-content>

  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class MainApp extends Vue {
  items: Array<any> = [
    {title: '首页', icon: 'home', to: '/'},
    {title: '识别', icon: 'search', to: '/preprocess'},
    {title: '批量识别', icon: 'youtube_searched_for', to: '/batchdetection'},
    {title: '组分库', icon: 'import_contacts', to: '/purelibrary'},
    {title: '设置', icon: 'settings', to: '/settings'},
  ]

  get dark() {
    return this.$store.state.dark;
  }
}
</script>

<style>
html {
  overflow-y: auto;
}
.global {
  font-family: '微软雅黑';
}
</style>

