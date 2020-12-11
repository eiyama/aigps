export default [
  {
    path: '/home/dataSearch/parkInfo',
    name: '/home/dataSearch/parkInfo',
    meta: {
      requireAuth: true, // 是否需要token
      keepAlive: false, // 是否需要keep-alive缓存页面
      isSideMenu: true, // 是否需要侧边栏菜单
      code: 'dataQuery', // 匹配后端返回菜单树的code
      parentPath: '/home' // 父级路由的path
    },
    component: () => import('@/page/dataSearch/base/parkInfo')
  },
  {
    path: '/home/dataSearch/baseNew/parkInfo',
    name: '/home/dataSearch/baseNew/parkInfo',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/baseNew/parkInfo')
  },
  {
    path: '/home/dataSearch/parkNoFlameout',
    name: '/home/dataSearch/parkNoFlameout',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/base/parkNoFlameout')
  },
  {
    path: '/home/dataSearch/mileage',
    name: '/home/dataSearch/mileage',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/base/mileage')
  },
  {
    path: '/home/dataSearch/newMileage',
    name: '/home/dataSearch/newMileage',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/base/newMileage')
  },
  {
    path: '/home/dataSearch/baseNew/mileage',
    name: '/home/dataSearch/baseNew/mileage',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/baseNew/mileage')
  },
  {
    path: '/home/dataSearch/baseNew/timeMileage',
    name: '/home/dataSearch/baseNew/timeMileage',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/baseNew/timeMileage')
  },
  {
    path: '/home/dataSearch/baseNew/dayMonthMileage',
    name: '/home/dataSearch/baseNew/dayMonthMileage',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/baseNew/dayMonthMileage')
  },
  {
    path: '/home/dataSearch/baseNew/run',
    name: '/home/dataSearch/baseNew/run',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/baseNew/run')
  },    
  {
    path: '/home/dataSearch/dayMonthMileage',
    name: '/home/dataSearch/dayMonthMileage',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/base/dayMonthMileage')
  },
  {
    path: '/home/dataSearch/acceleration',
    name: '/home/dataSearch/acceleration',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/drive/acceleration')
  },
  {
    path: '/home/dataSearch/deceleration',
    name: '/home/dataSearch/deceleration',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/drive/deceleration')
  },
  {
    path: '/home/dataSearch/fatigueDriving',
    name: '/home/dataSearch/fatigueDriving',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/drive/fatigueDriving')
  },
  {
    path: '/home/dataSearch/driverCount',
    name: '/home/dataSearch/driverCount',
    meta: {
      requireAuth: true,
      keepAlive: true,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/drive/driverCount')
  },
  {
    path: '/home/dataSearch/abnormalPath',
    name: '/home/dataSearch/abnormalPath',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/drive/abnormalPath')
  },
  
  {
    path: '/home/dataSearch/overspeed',
    name: '/home/dataSearch/overspeed',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/drive/overspeed')
  },
  {
    path: '/home/dataSearch/run',
    name: '/home/dataSearch/run',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/base/run')
  },
  {
    path: '/home/dataSearch/fenceCount',
    name: '/home/dataSearch/fenceCount',
    meta: {
      requireAuth: true,
      keepAlive: true,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/fence/fenceCount')
  },
  {
    path: '/home/dataSearch/area',
    name: '/home/dataSearch/area',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/fence/area')
  },
  {
    path: '/home/dataSearch/line',
    name: '/home/dataSearch/line',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/fence/line')
  },
  {
    path: '/home/dataSearch/electricity',
    name: '/home/dataSearch/electricity',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/busine/electricity')
  },
  {
    path: '/home/dataSearch/temperature',
    name: '/home/dataSearch/temperature',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/busine/temperature')
  },
  {
    path: '/home/dataSearch/sendcommand',
    name: '/home/dataSearch/sendcommand',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/base/sendcommand')
  },
  {
    path: '/home/dataSearch/offline',
    name: '/home/dataSearch/offline',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/base/offline')
  },
  {
    path: '/home/dataSearch/carExpire',
    name: '/home/dataSearch/carExpire',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/base/carExpire')
  },
  {
    path: '/home/dataSearch/activeSafetyMonthly',
    name: '/home/dataSearch/activeSafetyMonthly',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/base/activeSafetyMonthly')
  },
  {
    path: '/home/dataSearch/tirePressure',
    name: '/home/dataSearch/tirePressure',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/busine/tirePressure')
  },
  {
    path: '/home/dataSearch/load',
    name: '/home/dataSearch/load',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/busine/load')
  },
  {
    path: '/home/dataSearch/electricEnergy',
    name: '/home/dataSearch/electricEnergy',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/busine/electricEnergy')
  },
  {
    path: '/home/dataSearch/gyroscope',
    name: '/home/dataSearch/gyroscope',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/busine/gyroscope')
  },
  {
    path: '/home/dataSearch/lightRail',
    name: '/home/dataSearch/lightRail',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/busine/lightRail')
  },
  {
    path: '/home/dataSearch/insurance',
    name: '/home/dataSearch/insurance',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/busine/insurance')
  },
  {
    path: '/home/dataSearch/maintain',
    name: '/home/dataSearch/maintain',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/busine/maintain')
  },
  {
    path: '/home/dataSearch/swerve',
    name: '/home/dataSearch/swerve',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/drive/swerve')
  },
  {
    path: '/home/dataSearch/volumeLoad',
    name: '/home/dataSearch/volumeLoad',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/loadManage/volumeLoad')
  },
  {
    path: '/home/dataSearch/weightLoad',
    name: '/home/dataSearch/weightLoad',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/loadManage/weightLoad')
  },
  {
    path: '/home/dataSearch/event',
    name: '/home/dataSearch/event',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/loadManage/event')
  },
  {
    path: '/home/dataSearch/handAlarm',
    name: '/home/dataSearch/handAlarm',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/alarm/handAlarm')
  },
  {
    path: '/home/dataSearch/queryAlarm',
    name: '/home/dataSearch/queryAlarm',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/alarm/queryAlarm')
  },
  {
    path: '/home/dataSearch/ycxszj',
    name: '/home/dataSearch/ycxszj',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/alarm/ycxszj')
  },
  {
    path: '/home/dataSearch/zdaqzj',
    name: '/home/dataSearch/zdaqzj',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/alarm/zdaqzj')
  },
  {
    path: '/home/dataSearch/alarmAnalys',
    name: '/home/dataSearch/alarmAnalys',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/alarm/alarmAnalys')
  },

  {
    path: '/home/dataSearch/activeAlarm/handAlarm',
    name: '/home/dataSearch/activeAlarm/handAlarm',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/activeAlarm/handAlarm')
  },

  {
    path: '/home/dataSearch/activeAlarm/alarmAnalys',
    name: '/home/dataSearch/activeAlarm/alarmAnalys',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/activeAlarm/alarmAnalys')
  },

  {
    path: '/home/dataSearch/activeAlarm/safetyEvidence',
    name: '/home/dataSearch/activeAlarm/safetyEvidence',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/activeAlarm/safetyEvidence')
  },

  {
    path: '/home/dataSearch/activeAlarm/drivingEvidence',
    name: '/home/dataSearch/activeAlarm/drivingEvidence',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/activeAlarm/drivingEvidence')
  },

  {
    path: '/home/dataSearch/detailsDeviceAlarm',
    name: '/home/dataSearch/detailsDeviceAlarm',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/deviceAlarm/alarmDetails')
  },
  {
    path: '/home/dataSearch/deviceAlarmNew',
    name: '/home/dataSearch/deviceAlarmNew',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/devicerAlarmNew')
  },
  {
    path: '/home/dataSearch/sinCardQuery',
    name: '/home/dataSearch/sinCardQuery',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/simManage/sinCardQuery')
  },
  {
    path: '/home/dataSearch/simAll',
    name: '/home/dataSearch/simAll',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/simManage/simAll')
  },
  {
    path: '/home/dataSearch/dailyFlow30',
    name: '/home/dataSearch/dailyFlow30',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/simManage/dailyFlow30')
  },
  {
    path: '/home/dataSearch/sixMonthBill',
    name: '/home/dataSearch/sixMonthBill',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/simManage/sixMonthBill')
  },
  {
    path: '/home/dataSearch/sixMonthRecharge',
    name: '/home/dataSearch/sixMonthRecharge',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/simManage/sixMonthRecharge')
  },
  {
    path: '/home/dataSearch/sms90DaysContent',
    name: '/home/dataSearch/sms90DaysContent',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/simManage/sms90DaysContent')
  },
  {
    path: '/home/dataSearch/sms90DaysCount',
    name: '/home/dataSearch/sms90DaysCount',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/simManage/sms90DaysCount')
  },
  {
    path: '/home/dataSearch/findPools',
    name: '/home/dataSearch/findPools',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/simManage/findPools')
  },
  {
    path: '/home/dataSearch/poolInfo',
    name: '/home/dataSearch/poolInfo',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/simManage/poolInfo')
  },
  {
    path: '/home/dataSearch/smsContent',
    name: '/home/dataSearch/smsContent',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/simManage/smsContent')
  },
  {
    path: '/home/dataSearch/simExcessFlow',
    name: '/home/dataSearch/simExcessFlow',
    meta: {
      requireAuth: true,
      keepAlive: false,
      isSideMenu: true,
      code: 'dataQuery',
      parentPath: '/home'
    },
    component: () => import('@/page/dataSearch/simManage/simExcessFlow')
  }
]
