import { Component, Vue } from 'vue-property-decorator'
import { Divider, Alert } from 'ant-design-vue'
import hljs from 'highlight.js'

import 'highlight.js/styles/ocean.css'

import styles from '../../guide.less'

@Component
export default class SystemLocalStore extends Vue {
  protected mounted() {
    hljs.highlightBlock(this.$refs.systemcode)
    hljs.highlightBlock(this.$refs.systemcache)
    hljs.highlightBlock(this.$refs.systemclearcache)

  }
  render() {
    return <div class={styles.example}>
      <div class={styles.section}>
        <h2>系统组件状态持久化</h2>
        <Divider />
        <Alert type="info" message="可在系统配置中配置系统组件状态是否需要持久化（默认为打开），逻辑时借由vuex-persistedstate实现，打开配置后系统会在每次修改对应的值之际将最新的相关数据缓存到本地，在浏览器刷新后还原用户之前的配置" />
        <h4>需要缓存的系统状态Key</h4>
        <Alert showIcon={false} banner message="下示所有的key都储存在vuex的根级状态中，路径为src/store/index.tsx。只有出现在下述数组中的key才会被缓存至本地。" />
        <pre>
          <code ref="systemcode">{`
    // src/config/systemLocalStoreKey.ts
    export default [
      'version',//系统版本号
      'theme',//当前整体风格(默认dark)
      'themeColor',//当前主题色，由src/config/themeColor.ts列表映射出的key
      'navLayout',//导航布局模式(默认left)
      'fixedLeftMenu',//是否固定左侧菜单
      'fixedHeader',//是否固定顶部
      'tabTool',//是否具备Tab组件
      'tabMode',//Tab组件排列方式(暂未启用)
      'globalScroll',//是否全局滚动
      'language',//语言信息
      'siderMenu',//菜单menu状态，包含(1、展开的菜单。2、是否为收折状态)
      'tabList',//Tab组件列表
      'tabActive',//当前选中的Tab组件(也是当前路由)
      'tabHistory',//用户操作的Tab顺序记录
      'deviceType',//设备类型，初始化时会根据设备尺寸自动生成
      'systemLocalStore',//系统状态是否本地持久化
      'routerLocalStore',//路由页面状态是否本地持久化
      'loginInfo',//用户登录数据
      'rememberMe',//登录界面是否勾选了记住我
      'rememberLoginInfo'//本地加密存储用户登录数据
    ]
            `}
          </code>
        </pre>
        <h4>缓存逻辑</h4>
        <pre>
          <code ref="systemcache">{`
    import createPersistedState from 'vuex-persistedstate'
    import systemLocalStoreKey from '@/config/systemLocalStoreKey'

    createPersistedState({
      key: 'vue-tsx-admin',
      reducer(root) {
        // 当前系统配置是否需要持久化系统状态
        if (!root.systemLocalStore) {
          return {
            systemLocalStore: false
          }
        }
        const localStore: { [propsName: string]: any } = {}
        // 只遍历需要缓存key
        systemLocalStoreKey.forEach(key => {
          localStore[key] = root[key]
        })
        return localStore
      }
    })
          `}
          </code>
        </pre>
        <h4>清空系统缓存逻辑</h4>
        <Alert showIcon={false} banner message="系统会在两种情况下清空系统缓存：1、禁用系统数据持久化时。2、手动点击系统配置中底部的清除数据缓存按钮。" />
        <pre>
          <code ref="systemclearcache">{`
    RESET_LOCAL_STORE(state: { [propsName: string]: any }) {
      const initState: { [propsName: string]: any } = createState(defaultLanguage)
      // 只遍历已经缓存的key
      systemLocalStoreKey.forEach((key: string) => {
        // 排除掉登录数据（保留用户登录数据）
        if (key === 'loginInfo') return
        state[key] = initState[key]
      })
    }
          `}
          </code>
        </pre>
      </div>
    </div>
  }
}
