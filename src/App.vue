<template>
  <v-app class="global" :dark="dark">
    <v-navigation-drawer
      clipped
      app
      width="170"
      :class="{'grey': !dark, 'lighten-3': !dark}"
      permanent
      floating
    >
      <v-container>
        <v-layout text-xs-center wrap>
          <v-flex xs12>
            <v-img :src="require('./assets/full-spectrum.png')" class="my-1" contain height="60"></v-img>
          </v-flex>
          <v-flex xs12>
            <h3>拉曼光谱识别</h3>
          </v-flex>
        </v-layout>
      </v-container>

      <v-list dense>
        <v-list-tile v-for="item in items" :key="item.title" :to="item.to">
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
      <v-alert :value="showable" type="warning">{{ message }}</v-alert>
      <router-view></router-view>
      <log ref="logging"></log>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import repository from "@/repositories/Repository";
import { AxiosError } from "axios";
import Log from '@/components/Log.vue'

@Component({
  components: {
    Log
  }
})
export default class MainApp extends Vue {
  items: Array<any> = [
    { title: "首页", icon: "home", to: "/" },
    { title: "识别", icon: "search", to: "/preprocess" },
    { title: "组分库", icon: "import_contacts", to: "/purelibrary" },
    { title: "设置", icon: "settings", to: "/settings" }
  ];

  showable = false;
  message: string = "";

  constructor() {
    super();
    repository.interceptors.response.use(
      (response: any) => {
        this.alert(false);
        return response;
      },
      (err: AxiosError) => {
        // Don't know why but update prop here is invalid for DOM,
        // so use alert method instead.
        this.alert(true, err.message);
        return Promise.reject(err);
      }
    );
    // load preference
  }

  alert(showable: boolean, message: string = "") {
    this.showable = showable;
    this.message = message;
  }

  get dark() {
    return this.$store.state.dark;
  }

  mounted() {
    // register as a global component
    Vue.prototype.logging = this.$refs.logging;
  }
}
</script>

<style>
html {
  overflow-y: auto;
}
.global {
  font-family: "微软雅黑";
}
</style>

