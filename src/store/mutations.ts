import { Vue } from 'vue-property-decorator'
import { MutationTree  } from 'vuex'

import createMenu from '@/config/menu'

import { RootState, localStoreType } from './types'
import defaultHomeKey from '@/config/default.homeKey'
import enableRouterLocalStore from '@/utils/enableRouterLocalStore'
import localStore from '@/localStore'

const mutations: MutationTree<RootState> = {
  // 修改当前语言
  TOGGLE_LANGUAGE(state, lan) {
    state.language.current = Vue.prototype.$currentLanguage = lan
  },
  // 修改主题
  TOGGLE_THEME(state, theme) {
    state.theme = theme
  },
  // 修改主题色
  TOGGLE_THEME_COLOR(state, themeColor) {
    state.themeColor = themeColor
  },
  // 切换布局
  TOGGLE_NAVLAYOUT(state, navLayout) {
    state.navLayout = navLayout
  },
  // 修改是否展示tab组件
  TOGGLE_TABTOOL(state) {
    state.tabTool = !state.tabTool
  },
  // 展示tab排列模式
  TOGGLE_TABMODE(state, tabMode) {
    state.tabMode = tabMode
  },
  // 切换菜单收折状态
  TOGGLE_SIDERMENU(state, deviceType) {
    state.siderMenu.collapsed = !state.siderMenu.collapsed
    // 非手机设备在收折时清空展开的menu
    if (deviceType !== 'mobile') state.siderMenu.open = []
  },
  // 菜单二级三级菜单展开key
  OPEN_SIDERSUBMENU(state, open) {
    state.siderMenu.open = open
  },
  // 切换全局设备状态
  TOGGLE_DEVICETYPE(state, deviceType) {
    state.deviceType = deviceType;
  },
  // 固定左侧菜单
  TOGGLE_FIXED_LEFTMENU(state) {
    state.fixedLeftMenu = !state.fixedLeftMenu
  },
  // 固定顶部
  TOGGLE_FIXED_HEADER(state) {
    state.fixedHeader = !state.fixedHeader
  },
  // 全局滚动
  TOGGLE_GLOBAL_SCROLL(state) {
    state.globalScroll = !state.globalScroll
  },
  // 操作tab
  HANDLE_TAB(state, tabInfo) {
    const tabList = state.tabList,
          tabHistory = state.tabHistory
    const tab = tabList.find(item => item.id === tabInfo.id)
    if (!tab) {
      // 新增tab
      tabList.push(tabInfo)
      tabHistory.push(tabInfo.keyPath)
    }
    state.tabActive = tabInfo.id
  },
  // 移出tab
  REMOVE_TAB(state, { tabInfo, vm }) {
    state.tabHistory = state.tabHistory.filter(keyPath => keyPath !== tabInfo.keyPath)
    state.tabList = state.tabList.filter(item => item.id !== tabInfo.id)
    vm.$router.push(state.tabHistory[state.tabHistory.length - 1])
    if (vm.autoOffset && typeof vm.autoOffset === 'function') vm.autoOffset()
  },
  // 清除tab
  CLEAR_TAB(state, vm) {
    const newTabList = state.tabList.filter(item => item.id === defaultHomeKey)
    state.tabList = newTabList
    state.tabHistory = [newTabList[0].keyPath]
    vm.$router.push(newTabList[0].keyPath)
  },
  // 切换本地数据持久化
  TOGGLE_LOCAL_STORE(state, type: localStoreType) {
    state[type] = !state[type]
    // 页面数据本地持久化
    if (type === 'routerLocalStore') {
      if (state[type]) {
        window._enableRouterLocalStore = enableRouterLocalStore((this as any))
      } else if (window._enableRouterLocalStore && typeof window._enableRouterLocalStore === 'function') {
        window._enableRouterLocalStore()
        window._enableRouterLocalStore = null
        localStore.clear()
      }
    }
  },
  // 切换是否记住密码
  TOGGLE_REMREBER_ME(state, checked) {
    state.rememberMe = checked
    if (!state.rememberMe) {
      // 清空记住的密码
      state.rememberLoginInfo = null
    }
  },
  //记住密码
  REMEMBER_LOGIN_PARAMS(state, info) {
    state.rememberLoginInfo = info
  },
  // 设置登录信息
  SET_LOGIN_INFO(state, info) {
    // 根据权限=生成菜单
    const authMap = (info.auth as { [x: string]: any })[info.username]
    const menuTree = createMenu(authMap)
    state.menuTree = menuTree
    // 设置登录信息
    state.loginInfo = {
      ...info,
      auth: authMap
    }
  },
  // 退出登录
  LOGOUT(state) {
    // 清除登录数据
    state.loginInfo = {}
    // 清除系统的收折状态
    state.siderMenu.open = []
    state.siderMenu.collapsed = false
  }
};

export default mutations;
