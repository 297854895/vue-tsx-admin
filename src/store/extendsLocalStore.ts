export default {
  EXTENDS_LOCAL_STORE(state: any, store: { [propsName: string]: any }) {
    for (let key in store) {
      state[key] = store[key]
    }
  }
}
