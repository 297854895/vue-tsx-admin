import { Component, Vue, Prop } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import { Icon } from 'ant-design-vue'

import { deviceType, tabItem, languageType, routesInfoMap } from '@/store/types'

import styles from './index.less'

@Component
export default class TabManager extends Vue {
  visible: boolean = false;
  @Prop(String) deviceType !: deviceType;
  @Prop(Boolean) menuCollapsed !: boolean;
  @State('tabList') tabList !: Array<tabItem>;
  @State('routesInfoMap') routesInfoMap !: routesInfoMap;
  @State('tabActive') tabActive !: string;
  @State(state => state.language.current) currentLanguage !: languageType;
  @Action('clearTab') clearTab !: Function;
  @Action('removeTab') removeTab !: Function;
  open() {
    this.visible = !this.visible
  }
  clsoe(event: Event) {
    event.stopPropagation()
    this.visible = false
  }
  clearAll() {
    // 清除所有tab
    this.clearTab({ vm: this, tabList: this.tabList, routesInfoMap: this.routesInfoMap })
  }
  closeItem(item: tabItem, event: Event) {
    event.stopPropagation()
    const { module } = this.routesInfoMap[item.id]
    const removeInfo: {
      tabInfo: tabItem,
      vm: Vue,
      module?: Array<string>
    } = {
      tabInfo: item,
      vm: this
    }
    if (module && module.length > 0) {
      removeInfo.module = module
    }
    this.removeTab(removeInfo)
  }
  openTab(keyPath: string) {
    this.$router.push(keyPath)
  }
  render () {
    const {
      $locale,
      visible,
      tabList,
      tabActive,
      deviceType,
      menuCollapsed,
      currentLanguage
    } = this
    const locale = $locale[currentLanguage].menu
    return (
      <div
        onClick={!visible ? this.open : () => null}
        style={visible && deviceType !== 'mobile' ? { width: menuCollapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)'} : {}}
        class={
        `${styles.tabManager}
         ${
           !visible
           ? `${styles.tabManagerCircle} system-theme-background`
           : styles.tabWrap
         }
         `
       }>
        {
          !visible
          ? <Icon type="bars" />
          : <div style={{ height: '100%' }}>
            <div class={`${styles.shadowMask}`}></div>
            <button
              onClick={this.clsoe}
              class={`${styles.closeBt}`}>
              <a><Icon type="down" /></a>
            </button>
            <div class={styles.tabContainer}>
              <ul>
                {
                  tabList.map(item => {
                    return <a
                      onClick={() => this.openTab(item.keyPath)}
                      class={`
                        ${styles.tabItem}
                        system-theme-border
                        ${item.id === tabActive ? 'system-theme-background' : 'system-theme-default-color'}
                      `}
                      key={item.id}>
                      {locale[item.id]}
                    </a>
                  })
                }
              </ul>
            </div>
            <button
              onClick={this.clearAll}
              class={styles.clearAll}>
              <a>
                <Icon type="stop" />
              </a>
            </button>
          </div>
        }
      </div>
    )
  }
}
