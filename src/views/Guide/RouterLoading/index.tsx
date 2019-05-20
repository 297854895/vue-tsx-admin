import { Component, Vue } from 'vue-property-decorator'
import { Divider, Alert } from 'ant-design-vue'
import hljs from 'highlight.js'

import 'highlight.js/styles/ocean.css'

import styles from '../guide.less'

@Component
export default class SystemLocalStore extends Vue {
  protected mounted() {
    hljs.highlightBlock(this.$refs.asyncpage)
    hljs.highlightBlock(this.$refs.use)
    hljs.highlightBlock(this.$refs.routeconfig)
  }
  render() {
    return <div class={styles.example}>
      <div class={styles.section}>
        <h2>路由动画</h2>
        <Divider />
        <Alert message="项目中路由才用按需加载的模式，故项目在加载某些未加载过的页面时会发起网络请求，如果这个页面得静态资源过大，则页面会出现短暂白屏的情况，所以建议开启路由动画。" />
        <h4>AsyncPage组件</h4>
        <pre>
          <code ref="asyncpage">{`
    import { Vue, Component, Prop } from 'vue-property-decorator'
    import Loading from './Loading'
    // 初始化展示loading动画组件，等到异步加载成功后，重置为加载组件
    @Component
    export default class AsyncPage extends Vue {
      // 动态加载的组件
      @Prop(Function) load!: Function;
      // 动画延时
      @Prop(Number) delay!: number;
      template: any = Loading;
      async mounted() {
        const Template = await this.load()
        setTimeout(() => {
          this.template = Template.default
        }, this.delay || 0)
      }
      render() {
        const Page = this.template
        return <Page />
      }
    }

            `}
          </code>
        </pre>
        <h4>使用方法</h4>
        <pre>
          <code ref="use">{`
    // 以首页示例 src/views/Home/index.tsx
    import { AsyncPage } from '@/components'

    export default () => <AsyncPage load={() => import('./Home')} />
            `}
          </code>
        </pre>
        <pre>
          <code ref="routeconfig">{`
    // 路由配置
    {
      id: 'Home',
      name: 'Home',
      path: 'Home',
      component: () => import('@/views/Home') // 自动引入src/views/Home/index.tsx
    }
            `}
          </code>
        </pre>
      </div>
    </div>
  }
}
