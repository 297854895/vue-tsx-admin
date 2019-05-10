// create 必须为一个方法，返回一个全新的初始化状态
// 状态用户重置当前状态内所有的key
export default (create: Function) => ({
  CLEAR_STORE(state: any) {
    const initState = create()
    for (let key in initState) {
      state[key] = initState[key]
    }
  }
})
