<template>
  <v-app dark>
    <v-navigation-drawer clipped app class="elevation-12" right permanent>
      <tool-box></tool-box>
    </v-navigation-drawer>

    <v-toolbar app fixed clipped-left>
      <!-- <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon> -->
      <v-toolbar-title>Raman Spectrometer</v-toolbar-title>
    </v-toolbar>

    <v-content>
        <router-view></router-view>
        <v-btn id="test" bottom left>test</v-btn>
    </v-content>

    <v-footer app fixed>
      <v-spacer></v-spacer>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import ToolBox from '@/components/ToolBox.vue';

export default {
  components: {
    ToolBox,
  },
  data: () => ({
    drawer: null
  }),
  props: {
    source: String
  }
};
</script>

<style>
html {
  overflow-y: auto;
}
#test {
  position: fixed;
  bottom: 30px;
  left: 30px;
}
</style>

