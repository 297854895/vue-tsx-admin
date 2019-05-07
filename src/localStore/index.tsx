import localforage from 'localforage'

const localStore = localforage.createInstance({
  // localforage name
  name: 'vue-tab-router'
})

export default localStore
