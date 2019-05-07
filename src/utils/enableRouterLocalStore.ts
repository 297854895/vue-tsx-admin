import localStore from '@/localStore'

export default (store: { subscribe: Function }): Function => {
  return store.subscribe((mutation: { type: string }, state: { [propsName: string]: any }) => {
    // 非系统状态的更改
    if (mutation.type.indexOf('/') > -1) {
      const moduleName = mutation.type.split('/')[0]
      localStore.setItem(moduleName, state[moduleName])
    }
  })
}
