import { getToken, setToken, getUser, setUser, getTree, setTree, getLang, setLang } from '@/utils/auth'
import { getTreeUrlList } from '@/utils/data'
import { setCookieAll, clearCookieAll } from '@/utils/cookie'
import { login, tokenLogin, logo } from '@/api/user'
import { upLogo } from '@/api/sysetsmM/userConf'
// import { loginTTX } from '@/api/video'
import {ttxjsonp} from '@/utils/jsonp'
const host = process.env.VUE_APP_BASEURL_KY
const state = {
  token: getToken(),
  userInfo: getUser(),
  menuTree: getTree(),
  language: getLang(),
  jsession: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },

  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo;
  },

  SET_TREE: (state, tree) => {
    state.menuTree = tree
  },

  SET_LANG: (state, language) => {
    state.language = language
  },

  SET_JSESSION: (state, jsession) => {
    state.jsession = jsession
  }
}

const actions = {
  login({ commit }, userInfo) {
    const { userCode, userPwd, language, checked } = userInfo
    return new Promise((resolve, reject) => {
      login({ userCode: userCode.trim(), language, userPwd }).then(res => {
        if (res.result) {
          // 登录的时候勾选记住密码，反之则清除所有的cookie
          if (checked) {
            setCookieAll({ userCode: userCode.trim(), userPwd }, 7)
          } else {
            clearCookieAll()
          }

          commit('SET_TOKEN', res.result.token)
          setToken(res.result.token)

          commit('SET_USERINFO', res.result.user)
          setUser(res.result.user)

          const tree = getTreeUrlList(res.result.tree)
          commit('SET_TREE', tree)
          setTree(tree)

          resolve(tree)
        } else {
          reject()
        }
      })
      .catch(err => {
        reject(err)
      })
    })
  },

  tokenLogin({ commit }, token) {
    return new Promise((resolve, reject) => {
      tokenLogin({ token }).then(res => {
        if (res.result) {
          commit('SET_TOKEN', token)
          setToken(token)

          commit('SET_USERINFO', res.result.user)
          setUser(res.result.user)

          const tree = getTreeUrlList(res.result.tree)
          commit('SET_TREE', tree)
          setTree(tree)

          resolve(tree)
        } else {
          reject()
        }
      })
      .catch(err => {
        reject(err)
      })
    })
  },

  logout({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_USERINFO', {})
      commit('SET_TREE', [])
      sessionStorage.clear()
      resolve()
    })
  },

  logo({ commit, state }) {
    return new Promise(resolve => {
      logo().then(res => {
        if (res.result && res.result.cfgLogo) {
          const cfgLogo = res.result.cfgLogo
          const user = state.userInfo
          user.logo = `${process.env.VUE_APP_BASEURL}${cfgLogo.replace('/images', 'images')}?rdm=${Math.floor((Math.random() * 100000))}`
          commit('SET_USERINFO', user)
          setUser(user)
        }
        resolve(res)
      })
    })
  },

  upLogo({ commit, state }, data) {
    return new Promise((resolve, reject) => {
      upLogo(data).then(res => {
        if (res.result) {
          const baseUrl = process.env.VUE_APP_BASEURL;
          const url = res.result.replace('/images', 'images');
          const random = Math.floor((Math.random() * (100000-1)) + 1);
          const logo =  `${baseUrl}${url}?rdm=${random}`;
          const user = state.userInfo;
          user.logo = logo;
          commit('SET_USERINFO', user)
          setUser(user)
          resolve(logo)
        } else {
          reject()
        }
      })
      .catch(err => {
        reject(err)        
      })
    })
  },

  language({ commit }, language) {
    return new Promise(resolve => {
      commit('SET_LANG', language)
      setLang(language)
      resolve()
    })
  },

 async loginTTX({ commit }) {  
      const name = process.env.VUE_APP_NAME
      const pwd = process.env.VUE_APP_PWD;  
      const url = `${host}StandardApiAction_login.action?account=${name}&password=${pwd}`;
      var param = [];
      param.push({name: 'account', value: name});
      param.push({name: 'password', value: pwd});      
      var res = await ttxjsonp({data:{},url:url})      
      if (res && res.result === 0) {
          commit('SET_JSESSION', res.jsession)
        }
    // return new Promise(resolve => {
    //   loginTtx({}).then(res => {  
    //     console.log()      
    //     if (res && res.result === 0) {
    //       commit('SET_JSESSION', res.jsession)
    //     }
    //     resolve(res)
    //   })
    // })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
