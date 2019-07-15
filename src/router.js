import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import Management from './views/Management'
import Criterion from './views/Criterion'
import Unit from './views/Unit'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/management',
      name: 'management',
      component: Management
    },
    {
      path: '/criterion',
      name: 'criterion',
      component: Criterion
    },
    {
      path: '/unit/:id',
      name: 'unit',
      component: Unit
    }
  ]
})
