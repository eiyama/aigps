import axios from 'axios'
import axios from 'axios'
import { Message, Loading } from 'element-ui'
import store from '@/store'

axios.defaults.timeout = 60000;
axios.defaults.baseURL = process.env.VUE_APP_BASEURL;

axios.interceptors.request.use(
 
    config => {     
        if (config.isLock) {
          if (!lock) return {}
          lock = false
        }
        // 是否需要开启loading
        if (!config.isLoading) {
          if (!loadingInstance){
            loadingInstance = Loading.service({
                text: 'Loading',
                target: config.target || 'body',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.5)'
              })
          }             
        }
 
        if (store.getters.token) {                  
          config.headers['Authorization'] = store.getters.token
        }
        return config     
  },
  err => {
    return Promise.reject(error);
  });

export default axios;
