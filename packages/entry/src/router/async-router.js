import { componentsMap } from './router-config'

const views = import.meta.glob('../views/*/*.vue')

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map((item) => {
    const currentRouter = {
      path: item.path || `${(parent && parent.path) || ''}/${item.key}`,
      name: item.name || item.key,
      component:
        componentsMap[item.component || item.name] || views[`../views/${item.component}.vue`],
      meta: {
        ...item.meta,
        permissions: item.permissions?.length ? item.permissions : [item.name]
      }
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    item.redirect && (currentRouter.redirect = item.redirect)
    if (item.children?.length) {
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}
