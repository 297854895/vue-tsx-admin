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
