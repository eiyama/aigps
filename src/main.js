import Vue from 'vue'
import App from './App'
import { Button, Input , MessageBox} from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import router from '@/router'
import i18n from './i18n/i18n'
import store from './store'

import './permission'
import 'video.js/dist/video-js.css'

Vue.use(locale).use(Button).use(Input)
Vue.config.productionTip = false
Vue.prototype.$confirm = MessageBox.confirm
// 设置一个bus，用来处理多页面的通信
window.eventBus = new Vue()

new Vue({
	el: '#app',
	router,
	store,
	i18n,
	render: h => h(App)
})

console.log('版本信息：' + require('./../package.json').version)
