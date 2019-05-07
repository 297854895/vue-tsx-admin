import { BasicLayout, RouterLayout } from '@/layouts'
import defaultHomeKey from './default.homeKey'
// router config
// 此类型路由不支持自动生成至menu菜单
// {
//   id: 'login',
//   name: 'login',
//   public: true,
//   path: '/login',
//   component: () => import('@/views/Login')
// }
export default [
  // 公有路由
  {
    id: 'login',
    name: 'login',
    public: true,
    path: '/login',
    component: () => import('@/views/Login')
  },
  // 私有路由
  {
    id: 'basic-layout',
    name: 'basic-layout',
    path: '/',
    component: BasicLayout,
    /** 路由从此处开始配置 id与name需要与path保持一致
        菜单会根以下的层级进行自动生成
        i18国际化映射将会根据id值自src/locale里面的相应语言配置文字
        若路由配置具备module属性，代表该路由绑定了名为该属性的状态库，tab页在执行关闭时，会自动清空该状态库内所有状态
        注：module: [] 可以指定多个状态库的名字
    **/
    children: [
      {
        id: defaultHomeKey,
        name: defaultHomeKey,
        path: defaultHomeKey,
        icon: 'home',
        alias: '/',
        component: () => import('@/views/Home')
      },
      {
        id: 'testChild',
        name: 'testChild',
        path: 'testChild',
        icon: 'setting',
        component: RouterLayout,
        children: [
          {
            id: 'testChild0',
            name: 'testChild0',
            icon: 'user',
            path: 'testChild0',
            module: ['app'],
            component: () => import('@/views/About')
          },
          {
            id: 'testChild1',
            name: 'testChild1',
            icon: 'user',
            path: 'testChild1',
            component: () => import('@/views/Example')
          },
          {
            id: 'testChild2',
            name: 'testChild2',
            icon: 'user',
            path: 'testChild2',
            component: () => import('@/views/Example')
          },
          {
            id: 'testChild3',
            name: 'testChild3',
            icon: 'user',
            path: 'testChild3',
            component: () => import('@/views/Example')
          },
          {
            id: 'testChild4',
            name: 'testChild4',
            icon: 'user',
            path: 'testChild4',
            component: () => import('@/views/Example')
          },
          {
            id: 'testChild5',
            name: 'testChild5',
            icon: 'user',
            path: 'testChild5',
            component: () => import('@/views/Example')
          },
          {
            id: 'testChild6',
            name: 'testChild6',
            icon: 'user',
            path: 'testChild6',
            component: () => import('@/views/Example')
          },
          {
            id: 'testChild11',
            name: 'testChild11',
            icon: 'user',
            path: 'testChild11',
            component: () => import('@/views/Example')
          },
          {
            id: 'testChild21',
            name: 'testChild21',
            icon: 'user',
            path: 'testChild21',
            component: () => import('@/views/Example')
          },
          {
            id: 'testChild31',
            name: 'testChild31',
            icon: 'user',
            path: 'testChild31',
            component: () => import('@/views/Example')
          },
          {
            id: 'testChild41',
            name: 'testChild41',
            icon: 'user',
            path: 'testChild41',
            component: () => import('@/views/Example')
          },
          {
            id: 'testChild51',
            name: 'testChild51',
            icon: 'user',
            path: 'testChild51',
            component: () => import('@/views/Example')
          }
        ]
      },
      {
        id: 'subMenu2',
        name: 'subMenu2',
        path: 'subMenu2',
        icon: 'user',
        component: RouterLayout,
        children: [
          {
            id: 'testSubMenu0',
            name: 'testSubMenu0',
            icon: 'user',
            path: 'testSubMenu0',
            component: () => import('@/views/Example')
          },
          {
            id: 'subMenu333',
            name: 'subMenu333',
            path: 'subMenu333',
            icon: 'user',
            component: RouterLayout,
            children: [
              {
                id: 'testSubMenu10',
                name: 'testSubMenu10',
                icon: 'user',
                path: 'testSubMenu10',
                component: () => import('@/views/Example')
              },
              {
                id: 'testSubMenu11',
                name: 'testSubMenu11',
                icon: 'user',
                path: 'testSubMenu11',
                component: () => import('@/views/Example')
              }
            ]
          }
        ]
      }
    ]
  },
]
