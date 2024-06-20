import { RouterView } from 'vue-router'

const components = import.meta.glob('../../examples/**/*.vue')
const exampleRoute = Object.keys(components).reduce(
  (res, componentPath) => {
    const route = {
      path: componentPath.replace('../../examples/', ''),
      component: components[componentPath]
    }
    if (componentPath.includes('outRoot') || componentPath.includes('OutRoot')) {
      res.outRoot.push(route)
    } else {
      res.inRoot.push(route)
    }
    return res
  },
  {
    inRoot: [],
    outRoot: []
  }
)

const exampleRouterMapInRoot = []
const exmapleRouterMapOutRoot = []

if (import.meta.env.DEV) {
  exampleRouterMapInRoot.push({
    path: '/examples',
    name: 'examplesInRoot',
    component: RouterView,
    children: exampleRoute.inRoot
  })
  exmapleRouterMapOutRoot.push({
    path: '/examples-out',
    name: 'examplesOutRoot',
    component: RouterView,
    children: exampleRoute.outRoot
  })
}

export { exampleRouterMapInRoot, exmapleRouterMapOutRoot }
