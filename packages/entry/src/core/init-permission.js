import NProgress from 'nprogress'

import { SYSTEM_NAME, ACCESS_CONTROL } from '@/config'
import { useUserStore, useRouterStore } from '@/stores'
import router, { loginRouter, notFoundRouter, whiteList } from '@/router'

NProgress.configure({ showSpinner: false })
const loginRoutePath = loginRouter.path

router.beforeEach(async (to, from) => {
  NProgress.start()

  if (from.fullPath !== '/' && to.meta?.newWindow) {
    window.open(router.resolve(to).href, '_blank')
    return false
  }

  let navRes = false
  if (!ACCESS_CONTROL) {
    navRes = true
  } else {
    const userStore = useUserStore()
    const routerStore = useRouterStore()
    const token = userStore.token
    if (token) {
      if (to.path === loginRoutePath) {
        navRes = { path: routerStore.defaultRoutePath }
      } else {
        if (!userStore.hasRole) {
          const res = await userStore.getInfo()
          if (res) {
            await routerStore.generateRoutes({
              token,
              res
            })
            const redirect = from.query.redirect || to.redirectedFrom?.fullPath || to.path

            const query = redirect
              .split('?')
              .pop()
              .split('&')
              .reduce((query, item) => {
                const [k, v] = item.split('=')
                query[k] = v
                return query
              }, {})
            if (to.path === redirect) {
              navRes = { path: to.path, replace: true }
            } else {
              navRes = { path: redirect, query: query }
            }
          } else {
            navRes = { path: notFoundRouter.path }
          }
        } else {
          navRes = true
        }
      }
    } else {
      if (whiteList.includes(to.name)) {
        navRes = true
      }
      navRes = { path: loginRoutePath, query: { redirect: to.fullPath } }
    }
  }

  if (navRes) {
    document.title = to.meta?.title || SYSTEM_NAME
  }

  return navRes
})

router.afterEach(() => {
  NProgress.done()
})
