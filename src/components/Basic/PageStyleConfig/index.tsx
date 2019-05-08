import { Drawer, Divider, Icon, Tooltip, Alert, Switch, Button, Modal } from 'ant-design-vue'
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'

import { theme, languageType, navLayout, deviceType, tabMode, tabItem, routesInfoMap } from '@/store/types'
import appendLessFile from '@/utils/appendLessFile'

import themeColorList from '@/config/themeColor'
import defaultThemeColor from '@/style/defaultThemeColor'

import styles from './index.less'

import darkSVG from '@/assets/dark.svg'
import lightSVG from '@/assets/light.svg'
import leftSvg from '@/assets/leftlayout.svg'
import topSvg from '@/assets/toplayout.svg'

@Component
export default class PageStyleConfig extends Vue {
  buildLessOption: boolean = false;
  buildStyleMessage: null | any = null;
  @Prop(Boolean) visible !: boolean;
  @Prop(Function) close !: Function;
  @State(state => state.theme) theme !: theme;
  @State(state => state.tabTool) tabTool !: boolean;
  @State(state => state.tabList) tabList !: Array<tabItem>;
  @State(state => state.routesInfoMap) routesInfoMap !: routesInfoMap;
  @State(state => state.tabMode) tabMode !: tabMode;
  @State(state => state.themeColor) themeColor !: string;
  @State(state => state.navLayout) navLayout !: navLayout;
  @State(state => state.fixedHeader) fixedHeader !: boolean;
  @State(state => state.deviceType) deviceType !: deviceType;
  @State(state => state.globalScroll) globalScroll !: boolean;
  @State(state => state.fixedLeftMenu) fixedLeftMenu !: boolean;
  @State(state => state.systemLocalStore) systemLocalStore !: boolean;
  @State(state => state.routerLocalStore) routerLocalStore !: boolean;
  @State(state => state.language.current) currentLanguage !: languageType;
  @Action('toggleTabTool') toggleTabTool !: Function;
  @Action('toggleTabMode') toggleTabMode !: Function;
  @Action('toggleNavLayout') toggleNavLayout !: Function;
  @Action('toogleLocalStore') toogleLocalStore !:Function;
  @Action('toggleThemeColor') toggleThemeColor !: Function;
  @Action('toggleGlobalTheme') toggleGlobalTheme !: Function;
  @Action('toggleFixedHeader') toggleFixedHeader !: Function;
  @Action('toggleGlobalScroll') toggleGlobalScroll !: Function;
  @Action('toggleFixedLeftMenu') toggleFixedLeftMenu !: Function;
  @Action('clearAllLocalStore') clearAllLocalStore !: Function;
  @Watch('visible', { immediate: true })
  configClose() {
    // 处理关闭设置drawer后，出现body宽度计算为 calc(100% -15px)的bug
    if (!this.visible) document.body.style.width = '100%'
  }
  protected mounted() {
    this.setDefaultThemeColor(this.themeColor, true)
  }
  toggleTheme = (theme: string, currentTheme: theme) => () => {
    if (theme === currentTheme) return false
    this.toggleGlobalTheme(theme)
  }
  toggleNavPosition = (navLayout: string, currentLayout: navLayout) => () => {
    if (navLayout === currentLayout) return
    this.toggleNavLayout(navLayout)
  }
  // 切换到默认主题色
  setDefaultThemeColor(themeColor: string, isInit: boolean) {
    const currentColor: { key: string, color: string } = themeColorList.find((item: { key: string }) => item.key === themeColor) || themeColorList[0]
    if (isInit ? currentColor.color !== defaultThemeColor : true) this.toggleColor(currentColor, this.$locale[this.currentLanguage].pageStyleConfig, true)
  }
  // 切换主题色
  async toggleColor(
    themeInfo: { color: string; key: string },
    locale: { buildStyle: string, buildSuccess: string, buildError: string },
    noTip: boolean // 是否需要展示编译提示
  ) {
    const {
      $message,
      buildLessOption
    } = this
    if (!noTip) {
      this.buildStyleMessage = $message.loading(locale.buildStyle, 0)
    }
    if (!buildLessOption) {
      appendLessFile()
      this.buildLessOption = true
    }
    const lessJS = await import('less/dist/less.min.js')
    const res = await lessJS.default.modifyVars({
      '@primary-color': themeInfo.color
    })
    if (this.buildStyleMessage) {
      this.buildStyleMessage()
      this.buildStyleMessage = null
    }
    if (res.sheets > 0) {
      if (!noTip) {
        // 编译成功
        $message.success(locale.buildSuccess, 1)
      }
      this.toggleThemeColor(themeInfo)
    } else {
      // 编译失败
      $message.error(locale.buildError, 5)
      console.error(res)
    }
  }
  tabModeSelect = (mode: tabMode) => this.toggleTabMode(mode)
  clearStore(locale: { [propsName: string]: any }) {
    Modal.confirm({
      title: locale.clearStoreTitle,
      content: locale.clearStoreContent,
      onOk: () => this.clearAllLocalStore({ vm: this, tabList: this.tabList, routesInfoMap: this.routesInfoMap })
    })
  }
  render() {
    const {
      theme,
      $locale,
      tabTool,
      // tabMode,
      navLayout,
      deviceType,
      themeColor,
      fixedHeader,
      globalScroll,
      fixedLeftMenu,
      currentLanguage,
      routerLocalStore,
      systemLocalStore
    } = this,
    locale = $locale[currentLanguage].pageStyleConfig
    return <Drawer
      width="360"
      destoryOnClose
      wrapClassName={styles.pageStyleConfig}
      closable={false}
      onClose={this.close}
      visible={this.visible}>
      <Divider orientation="left">{locale.globalStyleText}</Divider>
      <div class={styles.configRow}>
        {
          ['dark', 'light'].map(type => (
            <Tooltip key={type}>
              <template slot="title">{locale[`${type}Theme`]}</template>
              <div
                onClick={this.toggleTheme(type, theme)}
                class={`${styles.configRowItem} system-theme-default-color`}>
                <img src={type === 'dark' ? darkSVG : lightSVG} />
                {
                  theme === type ? <Icon type="check" /> : null
                }
              </div>
            </Tooltip>
          ))
        }
      </div>
      <Divider orientation="left">{locale.themeConfig}</Divider>
      <div class={styles.configRow}>
        {
          themeColorList.map(item => (
            <Tooltip key={item.key}>
              <template slot="title">{locale[item.key]}</template>
              <div
                onClick={() => this.toggleColor(item, locale, false)}
                class={styles.colorItem}
                style={{ background: item.color }}>
                {
                  themeColor === item.key ? <Icon type="check" /> : null
                }
              </div>
            </Tooltip>
          ))
        }
      </div>
      <Divider orientation="left">{locale.navPosition}</Divider>
      <div class={styles.configRow}>
        {
          ['left', 'top'].map(type => (
            <Tooltip key={type}>
              <template slot="title">{locale[`${type}Nav`]}</template>
              <div
                onClick={this.toggleNavPosition(type, navLayout)}
                class={`${styles.configRowItem} system-theme-default-color`}>
                <img src={type === 'left' ? leftSvg : topSvg} />
                {
                  navLayout === type ? <Icon type="check" /> : null
                }
              </div>
            </Tooltip>
          ))
        }
        <Alert
          class={styles.alert}
          message={locale.navAlert}
          type="warning" />
      </div>
      <Divider orientation="left">{locale.tabTool}</Divider>
      <div class={styles.configRow}>
        <label>
          {locale.hasTabTool}
          <Switch
            checked={tabTool}
            onChange={this.toggleTabTool} />
        </label>
        {/**<label>
          {locale.tabMode}
          <Select
            disabled
            value={tabMode}
            class={styles.select}
            onChange={this.tabModeSelect}
            size="small">
            {
              ['scroll', 'compact'].map(item => (
                <Select.Option key={item} value={item}>
                  {locale[`${item}Tab`]}
                </Select.Option>
              ))
            }
          </Select>
        </label>**/}
      </div>
      <Divider orientation="left">{locale.localStore}</Divider>
      <div class={styles.configRow}>
        <label>
          {locale.systemLocalStore}
          <Switch
            checked={systemLocalStore}
            onChange={() => this.toogleLocalStore('systemLocalStore')} />
        </label>
        <label>
          {locale.routerLocalStore}
          <Switch
            checked={routerLocalStore}
            onChange={() => this.toogleLocalStore('routerLocalStore')} />
        </label>
        <Alert
          class={styles.alert}
          message={locale.localStoreTip}
          type="warning" />
      </div>
      <Divider orientation="left">{locale.otherConfig}</Divider>
      <div class={styles.configRow}>
        {
          deviceType !== 'mobile'
          ? <label>
            {locale.globalScroll}
            <Switch
              checked={globalScroll}
              disabled={!fixedHeader}
              onChange={this.toggleGlobalScroll} />
          </label> : null
        }
        <label>
          {locale.fixedHeader}
          <Switch
            onChange={this.toggleFixedHeader}
            checked={fixedHeader} />
        </label>
        <label>
          {locale.fixedLeftMenu}
          <Switch
            checked={fixedLeftMenu}
            onChange={this.toggleFixedLeftMenu}
            disabled={navLayout === 'top' || deviceType === 'mobile'} />
        </label>
      </div>
      <Button onClick={this.close} class={styles.button} type="primary">{locale.exist}</Button>
      <Button onClick={() => this.clearStore(locale)} type="danger" class={styles.closeButton}>{locale.clearStore}</Button>
    </Drawer>
  }
}
