import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Unit from './views/Unit'
import Department from './views/Department'

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
    }
  ]
})
