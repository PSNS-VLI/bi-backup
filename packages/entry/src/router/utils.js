import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

import { useUserStore } from '@/stores'

import { staticRouterMap } from './static-router'

/**
 * 检验是否有操作权限
 * @param permissions? {string[]=[]} - 补充的校验权限
 * @param routerName? {string} - 路由表中的路由名称
 * @param callback? {function|null=null} - 校验成功触发的回调函数
 * @param warning? {boolean=true} 是否展示警示消息
 * @return {boolean} - 是否拥有权限
 */
export const checkPermission = (
  permissions = [],
  routerName = '',
  callback = null,
  warning = true
) => {
  const userPermissions = useUserStore().role?.permissionIds || []
  const routerPermissions = (
    routerName ? getRouterPermissions(staticRouterMap, routerName) : []
  ).concat(permissions || [])
  const hasPermission = routerPermissions.reduce((hasPermission, curPermission) => {
    return hasPermission || userPermissions.includes(curPermission)
  }, !routerPermissions.length)
  if (warning && !hasPermission) {
    ElMessage.warning('您没有操作权限！')
  } else {
    typeof callback === 'function' && callback()
  }
  return hasPermission
}

export const getRouterPermissions = (routers, name) => {
  return routers.reduce((permissions, router) => {
    if (permissions.length) return permissions
    if (router.name === name) return router.meta?.permissions || []
    if (router?.children?.length) return getRouterPermissions(router.children, name)
    return []
  }, [])
}

export const getRoutesOutRoot = (routers) => {
  return routers.reduce((routesOutRoot, router) => {
    let routes = []
    if (router.meta?.outRoot) {
      routes = [router]
    } else if (router.children?.length) {
      routes = getRoutesOutRoot(router.children)
    }
    return routesOutRoot.concat(routes)
  }, [])
}

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
export const listToTree = (list, tree, parentId) => {
  list.forEach((item) => {
    if (item.parentId === parentId) {
      const child = {
        ...item,
        key: item.key || item.name,
        children: []
      }
      listToTree(list, child.children, item.id)
      if (child.children.length <= 0) {
        delete child.children
      }
      tree.push(child)
    }
  })
}

/**
 * 获取路由参数中的ID
 */
export const resolveQueryId = () => {
  return useRoute().query
}
