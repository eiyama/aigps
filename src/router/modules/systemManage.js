export default  [
  {
    path: '/home/sysetsmM/menuManage',
    name: '/home/sysetsmM/menuManage',
    meta: {
      requireAuth: true, // 该页面是否需要token
      keepAlive: false, // 该页面是否需要keep-alive缓存
      isSideMenu: true, // 该页面是否需要侧边栏菜单
      code: 'systemManage', // 与后端返回的菜单树的code匹配
      parentPath: '/home' // 父级路由的path
    },
    component: () => import('@/page/systemM/menu/menuManage')
  },
  {
    path: '/home/sysetsmM/buttonManage',
    name: '/home/sysetsmM/buttonManage',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'systemManage',
      parentPath: '/home'
    },
    component: () => import('@/page/systemM/menu/buttonManage')
  },
  {
    path: '/home/sysetsmM/newallMonitor',
    name: '/home/sysetsmM/newallMonitor',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'systemManage',
      parentPath: '/home'
    },
    component: () => import('@/page/systemM/newallMonitor')
  },  
  {
    path: '/home/sysetsmM/modelManage',
    name: '/home/sysetsmM/modelManage',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'systemManage',
      parentPath: '/home'
    },
    component: () => import('@/page/systemM/menu/modelManage')
  },
  {
    path: '/home/sysetsmM/userManage',
    name: '/home/sysetsmM/userManage',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'systemManage',
      parentPath: '/home'
    },
    component: () => import('@/page/systemM/user/userManage')
  },
  {
    path: '/home/sysetsmM/divisionManage',
    name: '/home/sysetsmM/divisionManage',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'systemManage',
      parentPath: '/home'
    },
    component: () => import('@/page/systemM/user/dptManage')
  },
  {
    path: '/home/sysetsmM/roleManage',
    name: '/home/sysetsmM/roleManage',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'systemManage',
      parentPath: '/home'
    },
    component: () => import('@/page/systemM/power/roleManage')
  },
  {
    path: '/home/systemM/deviceProtocolManage',
    name: '/home/systemM/deviceProtocolManage',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'systemManage',
      parentPath: '/home'
    },
    component: () => import('@/page/systemM/device/deviceProtocol')
  },
  {
    path: '/home/systemM/deviceTypeManage',
    name: '/home/systemM/deviceTypeManage',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'systemManage',
      parentPath: '/home'
    },
    component: () => import('@/page/systemM/device/deviceType')
  },
  {
    path: '/home/systemM/carManage',
    name: '/home/systemM/carManage',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'systemManage',
      parentPath: '/home'
    },
    component: () => import('@/page/systemM/car/carManage')
  },
  {
    path: '/home/systemM/driverManage',
    name: '/home/systemM/driverManage',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'systemManage',
      parentPath: '/home'
    },
    component: () => import('@/page/systemM/car/driverManage')
  },
  {
    path: '/home/systemM/setLog',
    name: '/home/systemM/setLog',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'systemManage',
      parentPath: '/home'
    },
    component: () => import('@/page/systemM/userConf/setLogo')
  }
]
