import axios from 'axios'
import { Message, Loading } from 'element-ui'
import store from '@/store'

let lock = true
let num = 0
// let axiosSource = axios.CancelToken.source()
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASEURL, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  // cancelToken: axiosSource.token
  // timeout: 5000 // request timeout
})
// axiosSource.cancel() // 调用这个方法关闭请求
let loadingInstance  = null
// request interceptor
service.interceptors.request.use(
  config => {
    num ++
    if (config.isLock) {
      if (!lock) return {}
      lock = false
    }
    // 是否需要开启loading
    if (!config.isLoading) {
      if (!loadingInstance) 
        loadingInstance = Loading.service({
          text: 'Loading',
          target: config.target || 'body',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.5)'
        })
    }
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['X-Token'] = getToken()
      config.headers['Authorization'] = store.getters.token
    }
    return config;
  },
  error => {
    num --
    if (loadingInstance) {
      if (num === 0) {
        loadingInstance.close()
        loadingInstance = null
      }
    }
    lock = true
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    num --
    const res = response.data
    if (loadingInstance) {
      if (num === 0 && res.result) {
        loadingInstance.close()
        loadingInstance = null
      }
    }
    lock = true    
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200 && !res.success && !(res instanceof Blob)) {
      Message({
        message: res.message || 'error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(res.message || 'error')
    } else {
      return res
    }
  },
  error => {
    num --
    if (loadingInstance) {
      if (num === 0) {
        loadingInstance.close()
        loadingInstance = null
      }
    }
    lock = true
    const data = error.response && error.response.data || null;
    if (data) {
      const message = data.error && data.error.message || 'error'; // error一般是网络问题
      Message({
        message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(data)
  }
)

export default service
