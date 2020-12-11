const getters = {
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  menuTree: state => state.user.menuTree,
  language: state => state.user.language,
  jsession: state => state.user.jsession,
  alarmIds: state => state.alarm.alarmIds,
  alarmNames: state => state.alarm.alarmNames,
  alarmNum: state => state.alarm.alarmNum,
  isMsg: state => state.alarm.isMsg,
  carTree: state => state.data.carTree,
  routes: state => state.permission.routes
}

export default getters;