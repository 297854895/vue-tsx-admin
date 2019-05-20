import { Component, Vue } from 'vue-property-decorator'
import { Divider, Alert, Button } from 'ant-design-vue'
import { State, namespace} from 'vuex-class'
import hljs from 'highlight.js'

import 'highlight.js/styles/ocean.css'

import styles from '../../guide.less'

const moduleStore = namespace('routerStore')

@Component
export default class RouterLocalStore extends Vue {
  @State('routerLocalStore') routerLocalStore!: boolean;
  @moduleStore.State('state') state!: number;
  @moduleStore.Action('testAction') testAction!: Function;
  protected mounted() {
    hljs.highlightBlock(this.$refs.create)
    hljs.highlightBlock(this.$refs.routes)

    hljs.highlightBlock(this.$refs.routerinit)
    hljs.highlightBlock(this.$refs.routercode)
    hljs.highlightBlock(this.$refs.routerrecovery)
  }
  render() {
    return <div class={styles.example}>
      <div class={styles.section}>
        <h2>路由页面状态持久化</h2>
        <Divider />
        <Alert type="info" message="系统支持将一些路由页面的数据缓存到本地，此类型缓存借助localforage完成，以支撑浏览器F5刷新后重现某些页面的数据。注：该功能系统默认关闭。" />
        <h4>路由数据持久化测试</h4>
        <div style={{ margin: '12px' }}>当前系统是否已开启路由数据持久化：{this.routerLocalStore ? <b style={{ color: 'green' }}>已开启</b> : <b style={{ color: 'red' }}>未开启</b>}</div>
        <div style={{ margin: '12px' }}>
          routerStore模块中的state当前值为：{this.state}
        </div>
        <div style={{ margin: '12px' }}>
          <Alert showIcon={false} banner message="点击按钮可使得state的值增长1，若处于路由数据持久化的状态下，刷新浏览器，此状态会被还原至刷新前的值。" />
          <Button style={{ margin: '12px 0' }} type="primary" onClick={this.testAction}>add state</Button>
          <Alert showIcon={false} type="error" message="注：关闭Tab，如果当前路由的配置中指定了module字段，则系统将会清空掉该路由的缓存以及vuex中当前内存中的数据。手动点击系统设置底部清除数据缓存按钮，该本地缓存同样会清空。" />
        </div>
        <h4>让具体页面支持路由数据持久化</h4>
        <Alert showIcon={false} banner message="若要具体页面支持此功能，需要做如下配置" />
        <ul>
          <li>
            <h5>如何创建数据模块</h5>
            <Alert type="info" message="下述例子展示如何创建当前路由的数据模块，关键步骤为：1、引入extendsLocalStore。2、引入clearStore。3、绑定至当前模块的mutations中。" />
            <pre style={{ marginTop: '16px' }}>
              <code ref="create">{`
    // src/store/models/routerStore/index.ts
    import { Module } from 'vuex'
    import { RouterLocalStore } from './types'
    import mutations from './mutations'
    import actions from './actions'

    import clearStore from '@/store/clearStore'
    import extendsLocalStore from '@/store/extendsLocalStore'

    const createState = (): RouterLocalStore => ({
      state: 1
    })

    const namespaced: boolean = true;

    const routerStore: Module<RouterLocalStore, any> = {
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

    export default routerStore

              `}
              </code>
            </pre>
          </li>
          <li>
            <h5>在src/confg/routes中配置module</h5>
            <pre>
              <code ref="routes">{`
    [
      {
        id: 'routerLocalStore',
        name: 'routerLocalStore',
        path: 'routerLocalStore',
        module: ['routerStore'],//module必须为数组，且名称为模块名字
        component: () => import('@/views/Guide/LocalStore/RouterLocalStore')
      },
    ]
                `}
              </code>
            </pre>
          </li>
        </ul>
      </div>
      <div class={styles.section}>
        <h2>路由页面状态持久化实现逻辑</h2>
        <Divider />
        <h4>缓存初始化</h4>
        <pre>
          <code ref="routerinit">{`
    // src/localStore/index.tsx
    import localforage from 'localforage'

    const localStore = localforage.createInstance({
      // localforage name
      name: 'vue-tsx-admin'
    })

    export default localStore

          `}
          </code>
        </pre>
        <h4>缓存/清空逻辑</h4>
        <pre>
          <code ref="routercode">{`
    // src/utils/enableRouterLocalStore.ts
    import localStore from '@/localStore'

    export default (store: { subscribe: Function }): Function => {
      // 订阅store的mutation改变，将vuex里面对应的模块作为key，缓存至本地
      return store.subscribe((mutation: { type: string }, state: { [propsName: string]: any }) => {
        // 非系统状态的更改
        if (mutation.type.indexOf('/') > -1) {
          const moduleName = mutation.type.split('/')[0]
          localStore.setItem(moduleName, state[moduleName])
        }
      })
    }

          `}
          </code>
        </pre>
        <h4>还原状态逻辑</h4>
        <Alert showIcon={false} banner message="在开启路由数据持久化时，系统初始化之际会读取本地的数据库长度，检测到存在本地缓存之际会执行还原操作。" />
        <pre>
          <code ref="routerrecovery">{`
    // src/main.ts
    import localStore from '@/localStore'
    // 系统在初始化时会执行initApp方法

    const initAPP = async () => {
        // 本地储存的key长度
        const len = await localStore.length().then(len => len)
        // 开启路由页面本地缓存与继承
        const enableRouterCache = store.state.routerLocalStore // 当前系统是否需要路由数据持久化
        if (enableRouterCache && len > 0) {
          // 开启缓存与本地数据持久化
          localStore.ready().then(() => {
            localStore.iterate((state, moduleName, idx) => {
              try {
                // 把初始化后的store提交继承store的commit, 并且将本地数据传递进去
                store.commit(moduleName + '/EXTENDS_LOCAL_STORE', state)
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

          `}
          </code>
        </pre>
      </div>
    </div>
  }
}
