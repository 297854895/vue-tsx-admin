import { Component, Vue, Prop } from 'vue-property-decorator'
import { Icon, Dropdown, Menu } from 'ant-design-vue'
import { State, Action } from 'vuex-class'

import PageStyleConfig from '../PageStyleConfig'
import { language } from '@/store/types'
import styles from './index.less'

@Component
export default class RightBox extends Vue {
  @Prop(String) deviceType !: string;
  @Prop(Boolean) top !: boolean;
  @Prop(String) theme !: string;
  @State(state => state.language) language !: language;
  @Action('toggleLanguage') toggleLanguage : Function;
  private systemConfigVisible: boolean = false;
  changeLanguage = (key: string) => (): Function => this.toggleLanguage(key);
  toggleSystemConfigVisible(): void {
    this.systemConfigVisible = !this.systemConfigVisible
  }
  render () {
    const {
      top,
      theme,
      language,
      deviceType
    } = this
    return <div class={`${styles.rightBox} ${deviceType !== 'desktop' ? styles.rightBoxMobile : ''} ${top ? styles[theme] : ''}`}>
      <Dropdown>
        <span class={`${styles.avaterWrap} system-theme-color`}>
          <div class={styles.avater}>
            <div>
              <Icon type="user" />
            </div>
          </div>
          <span>Alex</span>
        </span>
        <Menu slot="overlay">
          <Menu.Item>
            <Icon type="poweroff" />退出登录
          </Menu.Item>
        </Menu>
      </Dropdown>
      <Dropdown trigger={['click']}>
        <span class="system-theme-color">
          <Icon type="global" />
        </span>
        <Menu slot="overlay">
          {
            language.list.map(item => {
              return <Menu.Item
                onClick={this.changeLanguage(item.key)}
                key={item.key}>
                <span class={styles.menuItem}>{item.name}</span>
              </Menu.Item>
            })
          }
        </Menu>
      </Dropdown>
      <span
        class="system-theme-color"
        onClick={this.toggleSystemConfigVisible}>
        <Icon type="setting" />
      </span>
      <PageStyleConfig
        close={this.toggleSystemConfigVisible}
        visible={this.systemConfigVisible} />
    </div>
  }
}
