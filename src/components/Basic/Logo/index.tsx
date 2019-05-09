import { Component, Vue, Prop } from 'vue-property-decorator'
import styles from './index.less'
import logo from '@/assets/logo.svg'

@Component
export default class Logo extends Vue {
  @Prop(String) readonly theme!: string;
  @Prop(String) readonly type!: string;
  render () {
    const textClass = this.theme === 'light' ? 'system-theme-default-color' : ''
    return (
      this.type === 'menu'
      ? <div class={`${styles.menuLogo} ${styles[this.theme]}`}>
        <a>
          <img src={logo} />
          <h1 class={textClass}>Vue Tsx Admin</h1>
        </a>
      </div>
      : <div class={styles.topLogo}>
        <a>
          <img src={logo} />
          <h1 class={textClass}>Vue Tsx Admin</h1>
        </a>
      </div>
    )
  }
}
