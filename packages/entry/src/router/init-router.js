import { createRouter, createWebHashHistory } from 'vue-router'

import { ACCESS_CONTROL } from '@/config'

import { basicRouterMapOutRoot, getRootRouter } from './router-config'
import { exampleRouterMapInRoot, exmapleRouterMapOutRoot } from './auto-example'
import { staticRouterMap } from './static-router'
import { getRoutesOutRoot } from './utils'

const rootRouter = getRootRouter()
const staticRouterMapOutRoot = []
rootRouter.children = rootRouter.children.concat(exampleRouterMapInRoot)
if (!ACCESS_CONTROL) {
  rootRouter.children = rootRouter.children.concat(staticRouterMap)
  if (staticRouterMap.length) {
    rootRouter.redirect = staticRouterMap[0].path
  }
  getRoutesOutRoot(staticRouterMap).forEach((route) => staticRouterMapOutRoot.push(route))
}

const rootRouterWithExamples = rootRouter

const router = createRouter({
  history: createWebHashHistory(),
  routes: [rootRouter].concat(
    staticRouterMapOutRoot,
    basicRouterMapOutRoot,
    exmapleRouterMapOutRoot
  )
})

export default router
export { rootRouterWithExamples }
