import { Module } from 'vuex'
import { AppState } from './types'
import mutations from './mutations'
import actions from './actions'

import clearStore from '@/store/clearStore'
import extendsLocalStore from '@/store/extendsLocalStore'

const createState = (): AppState => ({
  state: 1
})

const namespaced: boolean = true;

const app: Module<AppState, any> = {
  namespaced,
  state: createState(),
  mutations: {
    // 绑定vuex的路由需要具备清除方法
    ...clearStore(createState),
    // 绑定路由页面缓存的页面需要具备还原状态的方法
    ...extendsLocalStore,
    ...mutations
  },
  actions,
}

export default app
