export default (clear: Function) => ({
  CLEAR_STORE(state: any) {
    const initState = clear()
    for (let key in initState) {
      state[key] = initState[key]
    }
  }
})
