import dataQuery from './modules/dataQuery'
import nav from './modules/nav'
import systemManage from './modules/systemManage'
import loadManage from './modules/loadManage'

// 动态路由
export const asyncRoutes = [
  {
    path: '/home',
    name: '/home',
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      keepAlive: true // 是否需要用keep-alive缓存
    },
    component: () => import('@/layouts'),
    children: []
  },
  ...dataQuery,
  ...systemManage,
  ...nav,
  ...loadManage
]

// 静态路由
export const constantRoutes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/login',
    name: '/login',
    meta: {
      requireAuth: false,
      keepAlive: false,
    },
    component: () => import('@/page/login')
  },
  {
    path: '/home/safeBigScreen',
    name: '/home/safeBigScreen',
    meta: {
      requireAuth: true,
      keepAlive: false
    },
    component: () => import('@/page/nav/home-new')
  }
]

