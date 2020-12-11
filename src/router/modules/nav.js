export default [
  {
    path: '/home/homePage',
    name: '/home/homePage',
    meta: {
      requireAuth: true, // 该页面是否需要token
      keepAlive: false, // 该页面是否需要keep-alive缓存
      isSideMenu: false, // 该页面是否需要侧边栏菜单
      parentPath: '/home' // 父级路由的path
    },
    component: () => import('@/page/nav/home')
  },
  {
    path: '/home/carMonitor/allMonitor',
    name: '/home/carMonitor/allMonitor',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: false,
      parentPath: '/home'
    },
    component: () => import('@/page/nav/allMonitor')
  },
  {
    path: '/home/carMonitor/newallMonitor',
    name: '/home/carMonitor/newallMonitor',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: false,
      parentPath: '/home'
    },
    component: () => import('@/page/nav/newallMonitor')
  },
  {
    path: '/home/carMonitor/carAnalysis',
    name: '/home/carMonitor/carAnalysis',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: false,
      parentPath: '/home'
    },
    component: () => import('@/page/nav/carAnalysis')
  },   
  {
    path: '/home/carMonitor/newCarAnalysis',
    name: '/home/carMonitor/newCarAnalysis',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: false,
      parentPath: '/home'
    },
    component: () => import('@/page/nav/newCarAnalysis')
  },    
  {
    path: '/home/carMonitor/carLineAnalysis',
    name: '/home/carMonitor/carLineAnalysis',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: false,
      parentPath: '/home'
    },
    component: () => import('@/page/nav/carLineAnalysis')
  }, 
  {
    path: '/home/playVideo',
    name: '/home/playVideo',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: false,
      parentPath: '/home'
    },
    component: () => import('@/page/nav/playVideo')
  }
]
