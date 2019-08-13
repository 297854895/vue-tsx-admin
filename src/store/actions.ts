import Vue from 'vue'
import { ActionTree } from 'vuex'

import crypto from '@/utils/crypto'
import authList from '@/config/auth.config'
import themeColor from '@/config/themeColor'
import defaultThemeColor from '@/style/defaultThemeColor'

import { loginApi } from '@/api'

import {
  theme,
  tabMode,
  tabItem,
  navLayout,
  RootState,
  deviceType,
  languageType,
  routesInfoMap,
  localStoreType
} from './types'

const actions: ActionTree<RootState, any> = {
  // 切换全局语言
  toggleLanguage({ commit }, lan: languageType) {
    commit('TOGGLE_LANGUAGE', lan)
  },
  // 修改全局主题
  toggleGlobalTheme({ commit }, theme: theme) {
    commit('TOGGLE_THEME', theme)
  },
  // 修改主题色
  toggleThemeColor({ commit }, themeColor: { key: string; color: string; }) {
    commit('TOGGLE_THEME_COLOR', themeColor.key)
  },
  // 修改导航布局
  toggleNavLayout({ commit }, navLayout: navLayout) {
    commit('TOGGLE_NAVLAYOUT', navLayout)
  },
  // 是否展示tab组件
  toggleTabTool({ commit }) {
    commit('TOGGLE_TABTOOL')
  },
  // tab组件排列模式
  toggleTabMode({ commit }, tabMode: tabMode) {
    commit('TOGGLE_TABMODE', tabMode)
  },
  // 切换左侧siderMenu的收折状态
  toggleSiderMenuCollapsed({ commit }, deviceType: deviceType) {
    commit('TOGGLE_SIDERMENU', deviceType)
  },
  // 展开siderMenu菜单
  openSiderSubMenu({ commit }, open: Array<string>) {
    commit('OPEN_SIDERSUBMENU', open)
  },
  // 切换客户端的类型，响应式布局
  toggleDeviceType({ commit }, deviceType: deviceType) {
    commit('TOGGLE_DEVICETYPE', deviceType)
  },
  // 切换左侧菜单固定
  toggleFixedLeftMenu({ commit }) {
    commit('TOGGLE_FIXED_LEFTMENU')
  },
  // 切换顶部固定
  toggleFixedHeader({ commit }) {
    commit('TOGGLE_FIXED_HEADER')
  },
  // 切换全局滚动
  toggleGlobalScroll({ commit }) {
    commit('TOGGLE_GLOBAL_SCROLL')
  },
  // 操作tab
  handleTab({ commit }, tabInfo: tabItem) {
    commit('HANDLE_TAB', tabInfo)
  },
  // 移出tab
  removeTab({ commit }, tabInfo: tabItem) {
    commit('REMOVE_TAB', tabInfo)
    if (tabInfo.module) {
      // 检测到需要清空的路由module
      tabInfo.module.forEach(moduleName => commit(`${moduleName}/CLEAR_STORE`))
    }
  },
  // 清除tab
  clearTab({ commit }, payload: { vm: Vue, tabList: Array<tabItem>, routesInfoMap: routesInfoMap }) {
    commit('CLEAR_TAB', payload.vm)
    if (payload.tabList && payload.tabList.length > 1) {
      payload.tabList.forEach(item => {
        const { module } = payload.routesInfoMap[item.id] || { module: false }
        if (module) module.forEach(moduleName => commit(`${moduleName}/CLEAR_STORE`))
      })
    }
  },
  // 切换本地数据持久化
  toogleLocalStore({ commit }, type: localStoreType) {
    commit('TOGGLE_LOCAL_STORE', type)
  },
  // 清空所有本地数据
  clearAllLocalStore({ commit }, payload: { vm: { setDefaultThemeColor: Function }, tabList: Array<tabItem>, routesInfoMap: routesInfoMap }) {
    // 默认系统数据
    commit('RESET_LOCAL_STORE')
    // 还原系统默认主题色
    const colorInfo: { key: string; color: string; } | undefined = themeColor.find(item => item.color === defaultThemeColor)
    if (payload.vm.setDefaultThemeColor) payload.vm.setDefaultThemeColor(colorInfo, false)
    // 清空tab以及路由数据
    commit('CLEAR_TAB', payload.vm)
    if (payload.tabList && payload.tabList.length > 1) {
      payload.tabList.forEach(item => {
        const { module } = payload.routesInfoMap[item.id]
        if (module) module.forEach(moduleName => commit(`${moduleName}/CLEAR_STORE`))
      })
    }
  },
  // 记住密码
  toggleRmemberMe({ commit }, checked: boolean) {
    commit('TOGGLE_REMREBER_ME', checked)
  },
  // 登录
  async login(store, params) {
    const res = await loginApi.login(params)
    if (typeof res === 'string' || !res) return res || '未查询到登录数据'
    store.commit('SET_LOGIN_INFO', {
      ...res,
      auth: authList
    })
    // 密码加密后缓存到本地
    if (params.username && store.state.rememberMe) store.commit('REMEMBER_LOGIN_PARAMS', {
      account: params.username,
      password: crypto.encrypt(params.password)
    })
    return true
  },
  // 退出登录
  async logout({ commit }) {
    await new Promise(res => {
      // 模拟网络请求
      setTimeout(res, 500)
    })
    commit('LOGOUT')
    return true
  }
}

export default actions;
