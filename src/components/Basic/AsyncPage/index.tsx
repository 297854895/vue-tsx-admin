import { Vue, Component, Prop } from 'vue-property-decorator'
import Loading from './Loading'

@Component
export default class AsyncPage extends Vue {
  @Prop(Function) load!: Function;
  @Prop(Number) delay!: number;
  template: any = Loading;
  async mounted() {
    const Template = await this.load()
    console.log(Template)
    setTimeout(() => {
      this.template = Template.default
    }, this.delay || 0)
  }
  render() {
    const Page = this.template
    return <Page />
  }
}
