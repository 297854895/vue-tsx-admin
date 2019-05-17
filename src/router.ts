import Router from 'vue-router'
import Vue from 'vue'

import routes from '@/config/routes'

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes()
});
