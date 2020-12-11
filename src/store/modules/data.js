import { getDptVehicleTree } from '@/api/vehicle'
import { getCarTree, setCarTree, clearItem } from '@/utils/auth'
const state = {
  carTree: getCarTree()
}

const mutations = {
  SET_CARTREE: (state, tree) => {
    state.carTree = tree
  }
}

const actions = {
  setCarTree({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (state.carTree) {
        resolve(state.carTree)
        return;
      }
      getDptVehicleTree().then(res => {
        if (res.success) {
          commit('SET_CARTREE', res.result)
          setCarTree(res.result)
          resolve(res.result)
        } else {
          reject()
        }
      })
      .catch(err => {
        reject(err)
      })
    })
  },
  clearTree({ commit }) {
    clearItem('carTree')
    commit('SET_CARTREE', false)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}