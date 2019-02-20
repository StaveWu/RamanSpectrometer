<template>
  <v-app class="global">
    <v-navigation-drawer clipped app class="grey lighten-3" width="200" permanent floating>
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
export default Vue.extend({
  data() {
    return {
      items: [
        {title: '数据采集', icon: 'dashboard', to: '/'},
        {title: '数据预处理', icon: 'dashboard', to: '/preprocess'},
        {title: '组分识别', icon: 'dashboard', to: '/recognition'},
        {title: '纯净光谱库', icon: 'dashboard', to: '/purelibrary'},
        {title: '标定', icon: 'dashboard', to: '/calibration'},
      ]
    }
  }
})
</script>

<style>
html {
  overflow-y: auto;
}
.global {
  font-family: '微软雅黑';
}
</style>

