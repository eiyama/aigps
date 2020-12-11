import { getAlarmConfigByUserId } from '@/api/alarm'
import { getIsMsg, setIsMsg } from '@/utils/auth'

const state = {
  alarmIds: '',
  alarmNames: '',
  alarmNum: 0,
  isMsg: getIsMsg()
}

const mutations = {
  SET_ALARMIDS: (state, alarmIds) => {
    state.alarmIds = alarmIds
  },

  SET_ALARMNAMES: (state, alarmNames) => {
    state.alarmNames = alarmNames
  },

  SET_ALARMNUM: (state, alarmNum) => {
    state.alarmNum = alarmNum
  },

  SET_ISMSG: (state, isMsg) => {
    state.isMsg = isMsg
  }
}

const actions = {
  /**
   * 获取报警的ids和names
   * @param {Array} alarmList 报警的树形数据
   */
  getAlarmConfigByUserId({ commit }, alarmList, total) {
    return new Promise(resolve => {
      getAlarmConfigByUserId(total).then(res => {
        if (res.success && Array.isArray(res.result)) {

          let ids = [],
            names = [];
          for (const [i, v] of res.result.entries()) {
            if (Array.isArray(v.alarmTypeConfigs)) {
              let isCheck = true;
              for (const [j, e] of v.alarmTypeConfigs.entries()) {
                alarmList[i].options[j].checked = e.isCloseAlarm
                if (!e.isCloseAlarm) {
                  isCheck = false;
                } else {
                  ids.push(e.alarmValue);
                  names.push(e.alarmDisplay);
                }
              }
              alarmList[i].checked = isCheck
            }
          }

          commit('SET_ALARMIDS', ids.join())
          commit('SET_ALARMNAMES', names.join())
          resolve(alarmList)
        }
      })
      .catch(err => {
    
      })
    })
  },

  /**
   * 修改控制是否需要更换视频弹窗提示的变量
   * @param {Boolean} isMsg
   */
  upIsMsg({ commit }, isMsg) {
    commit('SET_ISMSG', isMsg)
    setIsMsg(isMsg)
  },
  /**
   * 执行一次就把报警数加1
   * @param {Boolean} isAdd true就加加，false就清零
   */
  alarmAddOrClear({ commit, state }, isAdd) {
    if (isAdd) {
      commit('SET_ALARMNUM', state.alarmNum + 1)
    } else {
      commit('SET_ALARMNUM', 0)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}