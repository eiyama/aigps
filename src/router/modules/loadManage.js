export default [
  {
    path: '/home/loadManage/taskLatitude',
    name: '/home/loadManage/taskLatitude',
    meta: {
      requireAuth: true, // 是否需要token
      keepAlive: false, // 是否需要keep-alive缓存页面
      isSideMenu: true, // 是否需要侧边栏菜单
      code: 'loadManage', // 匹配后端返回菜单树的code
      parentPath: '/home' // 父级路由的path
    },
    component: () => import('@/page/loadManage/flowControl/taskLatitude')
  },
  {
    path: '/home/loadManage/taskEvent',
    name: '/home/loadManage/taskEvent',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'loadManage',
      parentPath: '/home'
    },
    component: () => import('@/page/loadManage/flowControl/taskEvent')
  },
  {
    path: '/home/loadManage/loadDetails',
    name: '/home/loadManage/loadDetails',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'loadManage',
      parentPath: '/home'
    },
    component: () => import('@/page/loadManage/flowControl/loadDetails')
  },
  {
    path: '/home/loadManage/setEngine',
    name: '/home/loadManage/setEngine',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'loadManage',
      parentPath: '/home'
    },
    component: () => import('@/page/loadManage/setting/engine')
  },
  {
    path: '/home/loadManage/calibration',
    name: '/home/loadManage/calibration',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'loadManage',
      parentPath: '/home'
    },
    component: () => import('@/page/loadManage/setting/calibration')
  },

  {
    path: '/home/loadManage/flowMonitoring',
    name: '/home/loadManage/flowMonitoring',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'loadManage',
      parentPath: '/home'
    },
    component: () => import('@/page/loadManage/flowMonitoring/monitoring')
  },

  {
    path: '/home/loadManage/runing',
    name: '/home/loadManage/runing',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'loadManage',
      parentPath: '/home'
    },
    component: () => import('@/page/loadManage/flowMonitoring/runing')
  },

  {
    path: '/home/loadManage/investigate',
    name: '/home/loadManage/investigate',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'loadManage',
      parentPath: '/home'
    },
    component: () => import('@/page/loadManage/flowCheck/investigate')
  },

  {
    path: '/home/loadManage/orderCheck',
    name: '/home/loadManage/orderCheck',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'loadManage',
      parentPath: '/home'
    },
    component: () => import('@/page/loadManage/flowCheck/orderCheck')
  },

]  