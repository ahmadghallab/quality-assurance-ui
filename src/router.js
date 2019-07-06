import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import Evaluate from './views/Evaluate'
import Department from './views/Department'
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
      path: '/department',
      name: 'department',
      component: Department
    },
    {
      path: '/unit/:id',
      name: 'unit',
      component: Unit
    },
    {
      path: '/unit/:id/evaluate',
      name: 'evaluate',
      component: Evaluate
    }
  ]
})
