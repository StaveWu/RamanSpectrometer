import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/preprocess',
      name: 'preprocess',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Preprocess.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('./views/Settings.vue'),
    },
    {
      path: '/purelibrary',
      name: 'purelibrary',
      component: () => import('./views/Purelibrary.vue'),
    },
    {
      path: '/batchdetection',
      name: 'batchdetection',
      component: () => import('./views/BatchDetection.vue'),
    },
  ],
});
