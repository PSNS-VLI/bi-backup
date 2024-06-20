import type { GxMenuItem } from './types'

type KeyType = string | ((item: any) => string)
type boolFun = (...args: any) => boolean

/**
 * Converts the compatible tree data into a structure compatible with the 'menus' property of the gx-menu component.
 * @param treeData Tree data.
 * @param childKey The key that identifies the child item.
 * @param labelKey The key that identifies the subitem title, which will be displyed in the menu.
 * @param pathKey The index of the item path which will be navicated when click the item.
 * @param filter Determines which items can pass through the filter.
 * @param interceptor An interceptor that decides whther to continue rendering subitem.
 * @returns {GxMenuItem[]}
 */
function generateMenus(
  treeData: any,
  childKey: string,
  iconKey: KeyType,
  labelKey: KeyType,
  pathKey: KeyType,
  filter: (item?: any, index?: number, array?: Array<any>) => boolean,
  interceptor: (item?: any) => boolean
): Array<GxMenuItem> {
  const judgeKey: (key: KeyType) => (item: any) => string = (key) => {
    return typeof key === 'function' ? key : (item: any) => item[key]
  }
  const judgeFun: (key: boolFun) => boolFun = (key) => {
    return typeof key === 'function' ? key : () => true
  }

  iconKey = judgeKey(iconKey)
  labelKey = judgeKey(labelKey)
  pathKey = judgeKey(pathKey)
  filter = judgeFun(filter)
  interceptor = judgeFun(interceptor)

  treeData = treeData.filter(filter)
  return treeData.map((treeItem: any) => {
    const menu: GxMenuItem = {
      icon: (iconKey as Function)(treeItem),
      label: (labelKey as Function)(treeItem),
      to: (pathKey as Function)(treeItem)
    }

    if (treeItem[childKey]?.length && !interceptor(treeItem)) {
      menu.children = generateMenus(
        treeItem[childKey],
        childKey,
        iconKey,
        labelKey,
        pathKey,
        filter,
        interceptor
      )
    }
    return menu
  })
}
/**
 * Generate a menu based on the vue router data structure.
 * @param routes Configuration array of the vue router.
 * @param iconKey Which item from meta determines the menu icon.
 * @param labelKey Which item from meta determines the menu title.
 * @param filterKey Which item from meta decides whether to display the menu.
 * @param interceptorkey Which item from meta decides not to render the submenu.
 * @returns {GxMenuItem[]}
 */
function getMenusFromVueRouter(
  routes: Array<any>,
  iconKey: string,
  labelKey: string,
  filterKey: string,
  interceptorkey: string
): Array<GxMenuItem> {
  routes = JSON.parse(JSON.stringify(routes))

  const menus = generateMenus(
    routes,
    'children',
    (item) => item.meta[iconKey],
    (item) => item.meta[labelKey],
    'path',
    (item) => !item?.meta?.[filterKey],
    (item) => item?.meta?.[interceptorkey]
  )

  menus.forEach((item) => {
    if (item.to.indexOf('/')) throw Error(`Illegal route: ${item.to} should start with '/'.`)
  })

  const recursionUnit = (menus: Array<GxMenuItem>, parPath: string = '') => {
    return menus.forEach((item) => {
      if (item.to.indexOf('/')) item.to = `${parPath}/${item.to}`
      if (item.children?.length) recursionUnit(item.children, item.to)
    })
  }
  recursionUnit(menus)

  return menus
}

export { generateMenus, getMenusFromVueRouter }
