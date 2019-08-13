import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import routerInfo from '@/config/routesInfo'

import { RootState, languageType, languageOption } from './types'
import defaultThemeColor from '@/style/defaultThemeColor'
import themeColor from '@/config/themeColor'
import defaultLanguage from '@/locale/default'
import defaultHomeKey from '@/config/default.homeKey'
import systemLocalStoreKey from '@/config/systemLocalStoreKey'
import getClientHW from '@/utils/getClientHW'

import * as modules from './models'
import mutations from './mutations'
import locale from '@/locale'

import actions from './actions'

const colorInfo: { key: string; color: string; } | undefined = themeColor.find(item => item.color === defaultThemeColor)

Vue.use(Vuex)

// 生成语言列表
const createLanguagelist = (locale: { [propname : string ]: { name: string } }) :Array<languageOption> => {
  const languageList: Array<languageOption> = []
  for (let key in locale) {
    languageList[languageList.length] = {
      key,
      name: locale[key].name
    }
  }
  return languageList
}
// 获取设备宽度
const clientHW = getClientHW()
// 根据路由生成key-value模式的路由信息映射表
// 主要用于关闭tab时，查询每个路由绑定的vuex的module名字
const routesInfoMap = routerInfo()

const createState = (lan: languageType): RootState => ({
  // 版本号
  version: '0.0.0',
  // 主题
  theme: 'dark',
  // 主题色
  themeColor: colorInfo ? colorInfo.key : 'color0',
  // 导航模式
  navLayout: 'left',
  // 固定左侧菜单
  fixedLeftMenu: true,
  // 固定头部
  fixedHeader: true,
  //是否具备tabTool
  tabTool: true,
  // tabTool 模式
  tabMode: 'scroll',
  // 全局滚动 or content 内部滚动
  globalScroll: false,
  // 语言配置
  language: {
    current: lan,
    list: createLanguagelist(locale)
  },
  // 菜单列表
  menuTree: [],
  // 菜单menu
  siderMenu: {
    collapsed: false,
    // menuTree,
    open: []
  },
  // tab列表
  tabList: [
    {
      id: defaultHomeKey,
      keyPath: `/${defaultHomeKey}`
    }
  ],
  // 当前tab
  tabActive: defaultHomeKey,
  // tab历史记录
  tabHistory: [`/${defaultHomeKey}`],
  // 客户端类型
  deviceType: clientHW.width > 1199 ? 'desktop' : clientHW.width > 576 ? 'tablet' : 'mobile',
  // 本地数据持久化
  systemLocalStore: true,
  // 功能页面数据持久化
  routerLocalStore: false,
  // 路由信息映射表
  routesInfoMap: routesInfoMap,
  // 用户信息
  loginInfo: {},
  // 是否记住密码
  rememberMe: false,
  // 记住密码
  rememberLoginInfo: null
})

export default new Vuex.Store({
  state: createState(defaultLanguage),
  actions,
  mutations: {
    // 清空本地vuex-persistedstate
    RESET_LOCAL_STORE(state: { [propsName: string]: any }) {
      const initState: { [propsName: string]: any } = createState(defaultLanguage)
      // 只遍历已经缓存的key
      systemLocalStoreKey.forEach((key: string) => {
        // 排除掉登录数据
        if (key === 'loginInfo') return
        state[key] = initState[key]
      })
    },
    ...mutations
  },
  modules: modules,
  // vuex-persistedstate 系统rootState缓存方式
  plugins: [createPersistedState({
    key: 'vue-tsx-admin',
    reducer(root) {
      if (!root.systemLocalStore) {
        return {
          systemLocalStore: false
        }
      }
      const localStore: { [propsName: string]: any } = {}
      // 只遍历需要缓存key
      systemLocalStoreKey.forEach(key => {
        localStore[key] = root[key]
      })
      return localStore
    }
  })]
});
