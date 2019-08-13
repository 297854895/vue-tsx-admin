import routes from './routes'
import { menuItem, routeItem } from '@/store/types'
const routesArr = routes()

const parseRoutes = (routesArr: Array<routeItem>, authMap: any) => {
  const menuArr: Array<menuItem> = [];
  routesArr.forEach((item: routeItem) => {
    if (item.public) return
    const menuItem: menuItem = { id: item.id, icon: item.icon }
    if (item.children) {
      // 多级路由
      menuItem.children = parseRoutes(item.children, authMap)
    } else {
      // 叶子节点
      if (authMap.includes(item.id)) menuItem.path = item.path
    }
    if (menuItem.path || (menuItem.children && menuItem.children.length > 0)) menuArr[menuArr.length] = menuItem
  })
  return menuArr
}

export default (authMap: any) => parseRoutes(routesArr[1].children as Array<routeItem>, authMap)
