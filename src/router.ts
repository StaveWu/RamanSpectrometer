import Vue from 'vue';
import Router from 'vue-router';
import Sample from './views/Sample.vue';
import Preoprocess from '/views/Preoprocess.vue';
import Recognition from '/views/Recognition.vue';
import Purelibrary from '/views/Purelibrary.vue';
import Calibration from '/views/Calibration.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'sample',
      component: Sample,
    },
    {
      path: '/preprocess',
      name: 'preprocess',
      component: Preoprocess
    }, 
    {
      path: '/recognition',
      name: 'recognition',
      component: Recognition
    }, 
    {
      path: '/purelibrary',
      name: 'purelibrary',
      component: Purelibrary
    }, 
    {
      path: '/calibration',
      name: 'calibration',
      component: Calibration
    }
  ],
});
