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
export default () => [
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
        id: 'form',
        name: 'form',
        path: 'form',
        icon: 'form',
        component: RouterLayout,
        children: [
          {
            id: 'basicForm',
            name: 'basicForm',
            icon: 'build',
            path: 'basicForm',
            component: () => import('@/views/Example')
          },
          {
            id: 'stepForm',
            name: 'stepForm',
            icon: 'block',
            path: 'stepForm',
            component: () => import('@/views/Example')
          },
          {
            id: 'advancedForm',
            name: 'advancedForm',
            icon: 'sliders',
            path: 'advancedForm',
            component: () => import('@/views/Example')
          }
        ]
      },
      {
        id: 'list',
        name: 'list',
        path: 'list',
        icon: 'bars',
        component: RouterLayout,
        children: [
          {
            id: 'searchTable',
            name: 'searchTable',
            icon: 'table',
            path: 'searchTable',
            component: () => import('@/views/List/SearchTable')
          },
          {
            id: 'basicList',
            name: 'basicList',
            icon: 'appstore',
            path: 'basicList',
            component: () => import('@/views/Example')
          },
          {
            id: 'cardList',
            name: 'cardList',
            icon: 'project',
            path: 'cardList',
            component: () => import('@/views/Example')
          },
          {
            id: 'searchList',
            name: 'searchList',
            icon: 'file-search',
            path: 'searchList',
            component: () => import('@/views/Example')
          }
        ]
      },
      {
        id: 'profile',
        name: 'profile',
        path: 'profile',
        icon: 'file',
        component: RouterLayout,
        children: [
          {
            id: 'basicProfile',
            name: 'basicProfile',
            icon: 'idcard',
            path: 'basicProfile',
            component: () => import('@/views/Example')
          },
          {
            id: 'advancedProfile',
            name: 'advancedProfile',
            icon: 'reconciliation',
            path: 'advancedProfile',
            component: () => import('@/views/Example')
          },
        ]
      },
      {
        id: 'account',
        name: 'account',
        path: 'account',
        icon: 'user',
        component: RouterLayout,
        children: [
          {
            id: 'accountCenter',
            name: 'accountCenter',
            icon: 'solution',
            path: 'accountCenter',
            component: () => import('@/views/Example')
          },
          {
            id: 'accountSetting',
            name: 'accountSetting',
            icon: 'setting',
            path: 'accountSetting',
            component: () => import('@/views/Example')
          },
        ]
      },
      {
        id: 'guide',
        name: 'guide',
        path: 'guide',
        icon: 'compass',
        component: RouterLayout,
        children: [
          {
            id: 'themeColor',
            name: 'themeColor',
            path: 'themeColor',
            icon: 'bg-colors',
            component: () => import('@/views/Example')
          },
          {
            id: 'tabTool',
            name: 'tabTool',
            path: 'tabTool',
            icon: 'tool',
            component: () => import('@/views/Example')
          },
          {
            id: 'pageStyle',
            name: 'pageStyle',
            path: 'pageStyle',
            icon: 'read',
            component: () => import('@/views/Example')
          },
          {
            id: 'otherConfig',
            name: 'otherConfig',
            path: 'otherConfig',
            icon: 'layout',
            component: () => import('@/views/Example')
          },
          {
            id: 'pageLoading',
            name: 'pageLoading',
            path: 'pageLoading',
            icon: 'loading',
            component: () => import('@/views/Guide/RouterLoading')
          },
          {
            id: 'localStore',
            name: 'localStore',
            path: 'localStore',
            icon: 'database',
            component: RouterLayout,
            children: [
              {
                id: 'systemLocalStore',
                name: 'systemLocalStore',
                path: 'systemLocalStore',
                component: () => import('@/views/Guide/LocalStore/SystemLocalStore')
              },
              {
                id: 'routerLocalStore',
                name: 'routerLocalStore',
                path: 'routerLocalStore',
                module: ['routerStore'],
                component: () => import('@/views/Guide/LocalStore/RouterLocalStore')
              }
            ]
          },
          {
            id: 'authorization',
            name: 'authorization',
            path: 'authorization',
            icon: 'lock',
            component: RouterLayout,
            children: [
              {
                id: 'loginValidate',
                name: 'loginValidate',
                path: 'loginValidate',
                component: () => import('@/views/Example')
              },
              {
                id: 'routerList',
                name: 'routerList',
                path: 'routerList',
                component: () => import('@/views/Example')
              },
              {
                id: 'menuList',
                name: 'menuList',
                path: 'menuList',
                component: () => import('@/views/Example')
              },
              {
                id: 'pageAuthorization',
                name: 'pageAuthorization',
                path: 'pageAuthorization',
                component: () => import('@/views/Example')
              },
            ]
          }
        ]
      },
    ]
  },
  {
    id: 'notfound',
    name: 'notfound',
    public: true,
    path: '/*',
    component: () => import('@/views/NotFound')
  }
]
