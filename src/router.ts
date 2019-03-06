import Vue from 'vue';
import Router from 'vue-router';
import Sample from './views/Sample.vue';
// import HelloWorld from './components/HelloWorld.vue'

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
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Preprocess.vue'),
    },
    {
      path: '/recognition',
      name: 'recognition',
      component: () => import('./views/Recognition.vue'),
    },
    {
      path: '/purelibrary',
      name: 'purelibrary',
      component: () => import('./views/Purelibrary.vue'),
    },
    {
      path: '/calibration',
      name: 'calibration',
      component: () => import('./views/Calibration.vue'),
    },
  ],
});
