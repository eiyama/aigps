import Vue from 'vue'
import VueRouter from 'vue-router'
import { constantRoutes } from './router'

Vue.use(VueRouter)

const createRouter = () => new VueRouter({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

//解决路径重复报错问题，添加处理错误方法;
const routerPush = VueRouter.prototype.push; 
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

