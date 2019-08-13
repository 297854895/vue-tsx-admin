import '@babel/polyfill/dist/polyfill.min.js'
import { message } from 'ant-design-vue'
import Vue from 'vue'
import localStore from '@/localStore'

import createThemeColorCss from '@/utils/createThemeColorCss'
import enableRouterLocalStore from '@/utils/enableRouterLocalStore'
import validateAuth from '@/utils/validateLogin'

import App from './App'
import store from '@/store'
import router from './router'

import locale from '@/locale'

import '@/style/reset.css'
import '@/style/index.css'

window._enableRouterLocalStore = null

Vue.config.productionTip = false;
// 语言映射
Vue.prototype.$locale = locale
// 全局message绑定
Vue.prototype.$message = message
// 初始化全局颜色配置
createThemeColorCss(store)

const initAPP = async () => {
  // 本地储存的key长度
  const len = await localStore.length().then(len => len)
  // 开启路由页面本地缓存与继承
  const enableRouterCache = store.state.routerLocalStore
  if (enableRouterCache && len > 0) {
    // 开启缓存与本地数据持久化
    localStore.ready().then(() => {
      localStore.iterate((state, moduleName, idx) => {
        try {
          // 修正不具备状态或者不需要持久化路由在开启路由持久化配置时，抛出异常的问题
          if ((store as any)._mutations[`${moduleName}/EXTENDS_LOCAL_STORE`]) store.commit(`${moduleName}/EXTENDS_LOCAL_STORE`, state)
        } catch (e) {
          console.error(e)
          return new Vue({
            router,
            store,
            render: h => h(App)
          }).$mount('#root');
        }
        if (idx === len) {
          // 读取本地库完成
          new Vue({
            router,
            store,
            render: h => h(App)
          }).$mount('#root');
        }
      })
    })
  } else {
    // 不开启缓存与本地数据持久化
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#root');
  }
  // 启动监听
  if (enableRouterCache) window._enableRouterLocalStore = enableRouterLocalStore(store)
}
// 初始化系统
initAPP()
// 未登录检测 权限检测
validateAuth(store, router)
