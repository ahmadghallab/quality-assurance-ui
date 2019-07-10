import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import Department from './views/Department'
import Unit from './views/Unit'
import Evaluation from './views/Evaluation'

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
      path: '/unit/:id/evaluation',
      name: 'evaluation',
      component: Evaluation
    }
  ]
})
