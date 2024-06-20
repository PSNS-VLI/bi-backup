import { defineStore } from 'pinia'
import cloneDeep from 'lodash/cloneDeep'

import { DYNAMIC_ROUTER } from '@/config'
import router, {
  staticRouterMap,
  listToTree,
  generator,
  basicRouterMapInRoot,
  basicRouterMapOutRoot,
  rootRouterWithExamples
} from '@/router'

/**
 * Judging if this account has the permission to the route
 * depending on 'permissions' and 'route.meta'
 *
 * @param permissions
 * @param route
 * @returns {boolean}
 */
function hasPermission(permissions, route) {
  if (route?.meta?.permissions?.length) {
    if (!permissions?.length) {
      return false
    }
    let flag = false
    for (const permission of permissions) {
      flag = route.meta.permissions.includes(permission)
      if (flag) {
        return true
      }
    }
    return false
  }
  return true
}

/**
 * Filtering the route which aren't accord with the role,
 * when an acount have more than one role.
 *
 * @param role
 * @param route
 * @returns {*}
 */
// eslint-disable-next-line
function hasRole(role, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(role.id)
  } else {
    return true
  }
}

/**
 * Recursicely filtering the asynchronous route and return
 * an accessible Router depending on the account's roles.
 *
 * @param {Object} routerMap
 * @param {Object} role
 * @return {Object}
 */
function filterAsyncRouter(routerMap, role) {
  const accessedRouters = routerMap.filter((route) => {
    if (hasPermission(role.permissionIds, route)) {
      if (route.children?.length) {
        route.children = filterAsyncRouter(route.children, role)
        route.redirect = route.children[0]?.path
      }
      return true
    }
    return false
  })
  return accessedRouters
}

/**
 * Generate dynamic routes.
 * @param {string} token
 * @returns
 */
const generateAsyncRoutes = async (token) => {
  if (!token) return []
  // const res = await loginApi.getCurrentUserNav.send(token)
  const res = {}
  const { result } = res
  const menuNav = []
  const childrenNav = []
  listToTree(result, childrenNav, 0)
  rootRouterWithExamples.children = childrenNav
  menuNav.push(rootRouterWithExamples)
  const routers = generator(menuNav)
  return routers
}

/**
 * Generate static routes.
 * @param {*}} role
 * @returns
 */
const generateStaticRoutes = (role) => {
  return filterAsyncRouter(cloneDeep(staticRouterMap), role)
}

export const useRouterStore = defineStore('router', {
  state: () => ({
    routers: [Object.assign({}, rootRouterWithExamples, { children: basicRouterMapInRoot })].concat(
      basicRouterMapOutRoot
    ),
    menuRouters: staticRouterMap,
    defaultRoutePath: '/'
  }),
  actions: {
    async generateRoutes(data) {
      const { res, token } = data
      let accessedRouters = []
      if (DYNAMIC_ROUTER) {
        accessedRouters = await generateAsyncRoutes(token)
      } else {
        accessedRouters = generateStaticRoutes(res)
      }

      this.menuRouters = accessedRouters
      this.resetRouter()
      this.routers = [
        Object.assign({}, rootRouterWithExamples, {
          redirect: accessedRouters[0]?.path,
          children: rootRouterWithExamples.children.concat(accessedRouters, basicRouterMapInRoot)
        })
      ].concat(basicRouterMapOutRoot)
      this.routers.forEach((route) => {
        router.addRoute(route)
      })
      return true
    },
    resetRouter() {
      this.routers.forEach((route) => router.removeRoute(route))
    }
  }
})
