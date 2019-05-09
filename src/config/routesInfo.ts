import routes from './routes'
import { routeItem, routesInfoMap } from '@/store/types'

const parseRoutesToMap = (routes: Array<routeItem>, routesInfoMap: routesInfoMap) => {
  routes
    .filter((item: routeItem) => !item.public || item.mutiTab)
    .forEach(route => {
      if (route.children && route.children.length > 0) {
        parseRoutesToMap(route.children, routesInfoMap)
      } else {
        routesInfoMap[route.id] = {
          module: route.module,
          public: route.public || false
        }
      }
    })
}

export default () => {
  const routesInfoMap: routesInfoMap = {}
  parseRoutesToMap(routes[1].children as routeItem[], routesInfoMap)
  return routesInfoMap
}
