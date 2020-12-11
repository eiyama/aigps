import router, { resetRouter } from '@/router'
import { getToken } from '@/utils/auth'
import store from './store'

const whiteList = ['/login'] // 路由白名单

router.beforeEach(async (to, from, next) => {
  // document.title = to.meta.title
  const { menuTree } = store.getters
  const hasToken = getToken()
  // 是否有token，有直接跳转
  const { path, meta, query } = to
  if (hasToken) {
    if (path === '/login') {
      if (menuTree && menuTree.length) {
        const [v] = menuTree
        next({ path: v.url, query: { code: v.code } })
      } else {
        resetRouter
        next()
      }
    } else {
      const { routes } = store.getters
      const hasRoutes = routes && routes.length
      if (hasRoutes) {      
        next()
      } else {      
        if (menuTree && menuTree.length) {
          const accessRoutes = await store.dispatch('permission/generateRoutes', menuTree)
          if (accessRoutes.length) router.addRoutes(accessRoutes)
          const redirect = decodeURIComponent(from.query.redirect || path)
          if (path === redirect) {
            // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record           
            next({ ...to, replace: true })                      
          } else {
            // 跳转到目的路由
            next({ path: redirect })
          }
        } else {
          query.redirect = path
          next({ path: '/login', query })
        }
      }
    }
  } else {
    if (whiteList.includes(to.name)) {
      next()
    } else {
      next({ path: '/login', replace: true, query })
    }
  }
})

router.afterEach(() => {
  console.log('afterEach')
})
