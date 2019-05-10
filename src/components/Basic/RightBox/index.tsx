import { Component, Vue, Prop } from 'vue-property-decorator'
import { Icon, Dropdown, Menu } from 'ant-design-vue'
import { State, Action } from 'vuex-class'

import PageStyleConfig from '../PageStyleConfig'
import { language, loginInfo, tabItem, routesInfoMap } from '@/store/types'
import styles from './index.less'

@Component
export default class RightBox extends Vue {
  @Prop(String) deviceType!: string;
  @Prop(Boolean) top!: boolean;
  @Prop(String) theme!: string;
  // 当前语言信息
  @State(state => state.language) language!: language;
  // 当前登录信息
  @State(state => state.loginInfo) loginInfo!: loginInfo;
  // tab信息
  @State(state => state.tabList) tabList!: Array<tabItem>;
  // 路由信息
  @State(state => state.routesInfoMap) routesInfoMap!: routesInfoMap;
  // 切换语言
  @Action('toggleLanguage') toggleLanguage: Function;
  // 退出登录
  @Action('logout') logout!: Function;
  // 清除所有tab
  @Action('clearTab') clearTab!: Function
  private systemConfigVisible: boolean = false;
  changeLanguage = (key: string) => (): Function => this.toggleLanguage(key);
  toggleSystemConfigVisible(): void {
    this.systemConfigVisible = !this.systemConfigVisible
  }
  // 执行退出登录操作
  async startLogout() {
    const res = await this.logout()
    if (!res) this.$message.error(this.$locale[this.language.current].login.logoutError)
    // 清除tab数组
    this.clearTab({
      vm: this,
      tabList: this.tabList,
      routesInfoMap: this.routesInfoMap
    })
    this.$router.push({
      name: 'login'
    })
  }
  render () {
    const {
      top,
      theme,
      language,
      loginInfo,
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
          <span>{loginInfo.nickname}</span>
        </span>
        <Menu slot="overlay">
          <Menu.Item onClick={this.startLogout}>
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
