import { constantRoutes, asyncRoutes } from '@/router/router'
import { getTreeChangeArr, getRoutes } from '@/utils/util'
import { resetRouter } from '@/router'
// import navs, { asyncNavs } from '@/router/nav'

const state = {
  routes: []
}

const mutations = {
  SET_ROUTES: (s, routes) => {
    if (!routes.length) {
      state.routes = []
    } else {
      state.routes = constantRoutes.concat(routes)
    }
  }
}

const actions = {
  generateRoutes({ commit }, menuTree) {
    return new Promise(resolve => {
      const menuArr = getTreeChangeArr(menuTree, 'child')
      const routes = asyncRoutes.reduce((arr, v) => {
        if (v.hasOwnProperty('children') || menuArr.some(e => e.url === v.path)) {
          arr.push(v)
        }
        return arr
      }, [])
      commit('SET_ROUTES', routes)
      const addRoutes = getRoutes(routes)
      resolve(addRoutes)
    })
  },
  clearRoutes({ commit }) {
    resetRouter()
    commit('SET_ROUTES', [])
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
