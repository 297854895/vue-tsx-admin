import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import { Icon } from 'ant-design-vue'

import styles from './index.less'

import { DOMInfo } from './types'
import defaultHomeKey from '@/config/default.homeKey'
import { bindEvent, removeEvent } from '@/utils/event'
import { tabItem, language, routesInfoMap, navLayout } from '@/store/types'

@Component
export default class TabTool extends Vue {
  tabOverFlow: boolean = false;
  leftArrow: boolean = false;
  rightArrow: boolean = false;
  tabDOMInfo: Array<DOMInfo> | any = [];
  tabInfo: DOMInfo | any = {};
  tabOffset: number = 0;
  tabTotalWidth: number = 0;
  windowResizeTimer: any | null = null;
  lastExcuteResize = 0;
  @Prop(String) mode !: string;
  @Prop(Boolean) show !: boolean;
  @Prop(String) navLayout !: navLayout;
  @Prop(String) deviceType !: string;
  @State('tabActive') tabActive !: string;
  @State('tabList') tabList !: Array<tabItem>;
  @State('language') language !: language;
  @State('routesInfoMap') routesInfoMap !: routesInfoMap;
  @Action('clearTab') clearTab :Function;
  @Action('handleTab') handleTab :Function;
  @Action('removeTab') removeTab :Function;
  // 是否具备tab组件变更重新绘制
  @Watch('show')
  onShowChange(status: boolean) {
    if (status) {
      this.handleSiderEvent('remove')
      this.handleWindowEvent('remove')
      this.$nextTick(() => this.autoOffset())
      this.handleSiderEvent('bind')
      this.handleWindowEvent('bind')
    } else {
      this.initTab()
      this.handleSiderEvent('remove')
      this.handleWindowEvent('remove')
    }
  }
  // tab组件的新增修改绘制
  @Watch('tabList', { deep: true })
  onTabListChange(newList: Array<tabItem>) {
    this.$nextTick(() => this.calculateTab())
    if (newList.length === 1) {
      this.initTab()
    }
  }
  // active tab更改绘制
  @Watch('tabActive')
  onTabActiveChnage(active: string) {
    // 根据active自动滚动该active tab至完全可视
    this.$nextTick(() => this.handleActiveNotShow(active))
  }
  protected mounted() {
    this.$nextTick(() => this.autoOffset())
    this.handleSiderEvent('bind')
    this.handleWindowEvent('bind')
  }
  // 初始化tab参数
  initTab() {
    this.tabOverFlow = false
    this.leftArrow = false
    this.rightArrow = false
    this.tabOverFlow = false
    this.tabDOMInfo = []
    this.tabInfo = {}
    this.tabOffset = 0
    this.tabTotalWidth = 0
  }
  // 计算tab的总长度，可是区域长度，容器信息
  calculateTab() {
    const tabContainer: any = this.$refs.tabContainer
    if (!tabContainer || !tabContainer.children) return false
    const childrenArr = tabContainer.children[0].children,
          childrenLen = childrenArr.length,
          tabInfo = tabContainer.getBoundingClientRect(),
          childrenInfo = []
    let totalWidth = 1
    for (let num = 0; num < childrenLen; num++) {
      const rectInfo = childrenArr[num].getBoundingClientRect()
      totalWidth += rectInfo.width - 1
      childrenInfo[childrenInfo.length] = rectInfo
    }
    this.tabInfo = tabInfo
    this.tabDOMInfo = childrenInfo
    this.tabTotalWidth = totalWidth
    if (totalWidth > tabInfo.width) {
      // 不显示左右箭头时，额外减去60像素
      if (this.navLayout === 'left' && !this.tabOverFlow) tabInfo.width -= 60
      this.tabOverFlow = true
    } else {
      // 能够完全展示完已有的tab
      this.tabOverFlow = false
    }
  }
  // 切换active tab时，计算不能完全显示的tab，滚动至完全可视
  handleActiveNotShow(active: string) {
    if (!this.show) return
    const tabContainer: any = this.$refs.tabContainer
    if (!tabContainer || !tabContainer.children) return
    const {
      tabOffset,
      tabList,
      tabDOMInfo,
      tabInfo
    } = this
    let showArea = tabOffset + 1
    let start = showArea
    const activeIndex = tabList.findIndex(item => item.id === active)
    for (let num = 0; num < activeIndex + 1; num++) {
      const item = tabDOMInfo[num]
      showArea += item.width - 1
      if (num === activeIndex - 1) {
        start = showArea
      }
    }
    if (showArea > tabInfo.width) {
      // 右侧显示不全
      this.tabOffset += tabInfo.width - showArea
      return
    }
    if (start < 0) {
      // 左侧显示不全
      this.tabOffset -= start
    }
  }
  operateTab(type: string) {
    let offset = this.tabOffset,
        pointer = 1,
        calculated = offset
    const showArea = this.tabInfo.width,
          tabLen = this.tabDOMInfo.length
    for (let num = 0; num < tabLen; num++) {
      const item = this.tabDOMInfo[num]
      pointer += item.width - 1
      if (type === 'next') {
        // 检测到存在不能完全展示的tab
        if (pointer + offset > showArea) {
          calculated = -(pointer - item.width)
          // 检测下一页后是否有剩余的空白，如若有空白，将tab朝右对齐
          const extraWidth = Math.abs(calculated) + showArea - this.tabTotalWidth
          if (extraWidth > 0) calculated += extraWidth
          break
        }
      } else if (type === 'prev') {
        if (pointer + offset >= 0) {
          calculated = -(pointer - showArea)
          if (calculated > 0) calculated = 0
          break
        }
      }
    }
    this.tabOffset = calculated
  }
  // 打开tab
  openTab(keyPath: string) {
    this.$router.push(keyPath)
  }
  // 清除所有tab
  clearExtraTab() {
    this.clearTab({ vm: this, tabList: this.tabList, routesInfoMap: this.routesInfoMap })
  }
  // 关闭tab
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
  // 监听或取消监听
  handleSiderEvent(type: string) {
    if (this.navLayout === 'top') return
    let SiderMenu = document.getElementById('s_siderMenu')
    SiderMenu = document.getElementById('s_siderMenu')
    if (!SiderMenu) return
    if (type == 'bind') return bindEvent(SiderMenu, 'transitionend', this.listenSideMenuChange, false)
    removeEvent(SiderMenu, 'transitionend', this.listenSideMenuChange, false)
  }
  // 监听或取消监听
  handleWindowEvent(type: string) {
    if (type == 'bind') return bindEvent(window, 'resize', this.listenWindowResize, false)
    removeEvent(window, 'resize', this.listenWindowResize, false)
  }
  // 监听左侧菜单的宽度变化
  listenSideMenuChange(e: TransitionEvent) {
    const SiderMenu = document.getElementById('s_siderMenu')
    if (e.target === SiderMenu && e.propertyName === 'width') {
      // 菜单宽度改变
      this.autoOffset()
    }
  }
  // 监听整体视窗的宽度改变，响应到tab组件上
  listenWindowResize({ timeStamp }: Event) {
    if (this.lastExcuteResize === 0) {
      this.lastExcuteResize = timeStamp
    } else if (timeStamp - this.lastExcuteResize < 300 && this.windowResizeTimer) {
      clearTimeout(this.windowResizeTimer)
      this.windowResizeTimer = null
    }
    this.windowResizeTimer = setTimeout(() => {
      this.autoOffset()
      clearTimeout(this.windowResizeTimer)
      this.windowResizeTimer = null
      this.lastExcuteResize = 0
    }, 300)
  }
  // 自动设置位置和滚动
  autoOffset() {
    this.calculateTab()
    this.tabOffset = 0
    this.handleActiveNotShow(this.tabActive)
  }
  render () {
    const {
      // mode,
      show,
      navLayout,
      tabOffset,
      tabOverFlow,
      tabTotalWidth,
      tabList,
      tabActive,
      $locale,
      language
    } = this

    const tabTranslate = $locale[language.current].menu

    return <div
      class={`
        ${styles.tabContainer}
        ${
          navLayout === 'top' || tabOverFlow
          ? styles.tabContainerPadding
          : tabList.length > 1
          ? styles.tabContainerClear
          : ''
        }
        ${navLayout === 'top' ? styles.tabContainerTopNav : ''}
        `}>
      {
        tabOverFlow
        ? <button
          disabled={tabOffset === 0 ? true : false}
          onClick={() => this.operateTab('prev')}
          class={`${styles.arrowBt} system-theme-color`}>
          <Icon type="left" />
        </button> : null
      }
      {
        show
        ? <div
          class={styles.tabWrap}
          ref="tabContainer">
          <ul
            style={{ transform: `translate3d(${tabOffset}px, 0, 0)` }}>
            {
              tabList.map(item => <li
                onClick={() => this.openTab(item.keyPath)}
                class={`
                  ${styles.tabItem}
                  ${defaultHomeKey === item.id ? '' : styles.tabItemClose}
                  ${tabActive === item.id ? styles.tabItemActive : ''}`}>
                {tabTranslate[item.id]}
                {
                  defaultHomeKey !== item.id
                  ? <Icon onClick={(event: any) => this.closeItem(item, event)} type="close" />
                  : null
                }
              </li>)
            }
          </ul>
        </div> : null
      }
      {
        tabOverFlow
        ? <button
          disabled={Math.abs(tabOffset) + this.tabInfo.width >= tabTotalWidth ? true : false}
          onClick={() => this.operateTab('next')}
          class={`${styles.arrowBt} system-theme-color`}>
          <Icon type="right" />
        </button> : null
      }
      {
        tabList.length > 1 && show
        ? <button
          onClick={this.clearExtraTab}
          class={`${styles.arrowBt} system-theme-color`}>
          <Icon type="stop" />
        </button> : null
      }
    </div>
  }
}
