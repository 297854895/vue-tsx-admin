import routes from './routes'
import { menuItem, routeItem } from '@/store/types'

const parseRoutes = (routes: Array<routeItem>) => {
  return routes
    .filter((item: routeItem) => !item.public || item.mutiTab)
    .map((item: routeItem) => {
      const menuItem: menuItem = {
        id: item.id,
        icon: item.icon
      }
      if (item.children) {
        menuItem.children = parseRoutes(item.children)
      } else {
        menuItem.path = item.path
      }
      return menuItem
  })
}

export default () => parseRoutes(routes[1].children as routeItem[])
