import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Survey from './views/Survey.vue'
import Summary from './views/Summary.vue'
import store from './store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/survey',
      name: 'survey',
      component: Survey,
      beforeEnter: (to, from, next) => {
        if (!store.getters.loginStatus || store.getters.loginType) {
          return next({ name: 'home' })
        }
        next()
      }
    },
    {
      path: '/summary',
      name: 'summary',
      component: Summary,
      beforeEnter: (to, from, next) => {
        if (!store.getters.loginType) {
          return next({ name: 'home' })
        }
        next()
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  store.commit('setActivePage', to.name)
  next()
})

export default router
