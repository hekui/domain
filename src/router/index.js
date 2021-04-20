import Vue from 'vue'
import Router from 'vue-router'

import index from '../views/index'

Vue.use(Router)
// const myMain = () => import(/* webpackChunkName: "myMain" */ '../views/main')
const domain = () => import(/* webpackChunkName: "domain" */ '@/views/domain/index')

const userLayout = () => import(/* webpackChunkName: "userLayout" */ '@/views/user/_layout')
const userIndex = () => import(/* webpackChunkName: "userLayout" */ '@/views/user/index')
const userUpgrade = () => import(/* webpackChunkName: "userUpgrade" */ '@/views/user/upgrade')
const userFav = () => import(/* webpackChunkName: "userFav" */ '@/views/user/fav')
const userRepair = () => import(/* webpackChunkName: "userUpload" */ '@/views/user/repair')

// 404
const NotFoundComponent = () => import(/* webpackChunkName: "404" */ '../views/404/')

export function createRouter () {
  const router = new Router({
    mode: 'history',
    fallback: false,
    // savedPosition: {},
    // scrollBehavior (to, from, savedPosition) {
    //   if (savedPosition) {
    //     return savedPosition
    //   } else {
    //     return { x: 0, y: 0 }
    //   }
    // },
    routes: [
      { path: '/', component: index },
      { path: '/domain', component: domain },
      {
        path: '/user',
        component: userLayout,
        children: [
          {
            path: '',
            component: userIndex,
            name: 'userIndex',
          },
          {
            path: 'upgrade',
            component: userUpgrade,
            name: 'userUpgrade',
          },
          {
            path: 'fav',
            component: userFav,
            name: 'userFav',
          },
          {
            path: 'repair',
            component: userRepair,
            name: 'userRepair',
          }
        ]
      },
      // { path: '/login', component: () => import(/* webpackChunkName: "login" */ '@/views/Login/index') },
      // 404页面，确保在路由最后
      { path: '*', name: '404', component: NotFoundComponent }
    ]
  })
  return router
}
