import localforage from 'localforage'

const localStore = localforage.createInstance({
  // localforage name
  name: 'vue-tsx-admin'
})

export default localStore
