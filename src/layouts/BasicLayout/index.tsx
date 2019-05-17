import { Component, Vue } from 'vue-property-decorator'
import { Icon, Drawer, Spin } from 'ant-design-vue'
import { State, Action } from 'vuex-class'

import { siderMenu, deviceType, navLayout, tabMode, routesInfoMap, menuItem } from '@/store/types'
import { theme } from '@/store/types'

import { SiderMenu, Logo, TabTool, RightBox, TabManager } from '@/components'

import styles from './index.less'


@Component
export default class BasicLayout extends Vue {
  // 主题
  @State('theme') theme: theme;
  // 导航位置
  @State('navLayout') navLayout: navLayout;
  // 是否固定顶部
  @State('fixedHeader') fixedHeader: boolean;
  // 是否固定左侧menu
  @State('fixedLeftMenu') fixedLeftMenu: boolean;
  // 是否展示tab组件
  @State('tabTool') tabTool: boolean;
  // 当前激活状态的tab
  @State('tabActive') tabActive : string;
  // tab排列方式
  @State('tabMode') tabMode: tabMode;
  // 是否全局滚动
  @State('globalScroll') globalScroll: boolean;
  // 左侧siderMenu状态
  @State('siderMenu') siderMenu: siderMenu;
  // 菜单的MenuTree
  @State('menuTree') menuTree: Array<menuItem>;
  // 当前客户端类型
  @State('deviceType') deviceType: deviceType;
  // 路由信息
  @State('routesInfoMap') routesInfoMap: routesInfoMap;
  // 登录信息
  @Action('handleTab') handleTab!: Function;
  // 左侧menu展开二级菜单
  @Action('openSiderSubMenu') openSiderSubMenu!: Function;
  // 切换左侧menu的收折状态
  @Action('toggleSiderMenuCollapsed') toggleSiderMenuCollapsed!: Function;
  // 监听路由变化
  protected mounted() {
    this.$router.beforeEach(this.listenRouteChange)
    // 验证路由
    this.validateActiveRouter()
  }
  // 监听路由变化，统一维护tab的新增或者切换
  listenRouteChange(
    newpath: { [prospName: string]: any },
    _oldpath: any,
    next: Function
  ) {
    if (this.routesInfoMap[newpath.name] && !this.routesInfoMap[newpath.name].public) {
      this.handleTab({
        id: newpath.name,
        keyPath: newpath.path
      })
    }
    next()
  }
  // 验证当前路由是否与当前active的tab一致，若不一致，进行active tab path跳转
  validateActiveRouter() {
    // 不一致
    if (this.$route.name !== this.tabActive) this.$router.push({
      name: this.tabActive
    })
  }
  render() {
    // 获取需要实用的状态
    const {
      theme,
      tabMode,
      tabTool,
      menuTree,
      navLayout,
      tabActive,
      deviceType,
      fixedHeader,
      globalScroll,
      siderMenu: {
        collapsed,
        open
      },
      fixedLeftMenu
    } = this
    return <section
      class={`${styles.basicLayout} ${ theme === 'dark' ? styles.dark : styles.light }`}>
      {
        // 非mobile设备
        navLayout === 'left' || deviceType === 'mobile'
        ? (deviceType !== 'mobile'
          ? (<aside
              id="s_siderMenu"
              style={{ width: !collapsed ? '256px' : '80px' }}
              class={`
                ${fixedLeftMenu ? styles.fixedLeftMenu : ''}
              `}>
              <div>
                <Logo type="menu" theme={theme} />
                <div class={styles.leftMenuWrap}>
                  <SiderMenu
                    open={open}
                    theme={theme}
                    menu={menuTree}
                    tabActive={tabActive}
                    collapsed={collapsed}
                    class={`${styles.siderMenu}`}
                    openSiderSubMenu={this.openSiderSubMenu} />
                </div>
              </div>
            </aside>)
          : <Drawer
              width="256"
              placement="left"
              closable={false}
              visible={!collapsed}
              wrapClassName={styles[`${theme}Menu`]}
              onClose={() => this.toggleSiderMenuCollapsed(deviceType)}>
              <Logo type="menu" theme={theme} />
              <SiderMenu
                open={open}
                theme={theme}
                menu={menuTree}
                tabActive={tabActive}
                class={styles.siderMenu}
                deviceType={this.deviceType}
                closeMenu={() => this.toggleSiderMenuCollapsed(deviceType)}
                openSiderSubMenu={this.openSiderSubMenu} />
          </Drawer>
        ) : null
      }
      <section class={`
          ${styles.contentLayout}
          ${fixedHeader && !globalScroll ? styles.notGlobalScroll : ''}
        `}>
        {
          navLayout === 'left' || deviceType === 'mobile'
          ? <header
            style={
              fixedHeader && globalScroll
              ? { background: '#fff!important', width: `calc(100% - ${collapsed ? deviceType === 'mobile' ? 0 : 80 : 256}px)` }
              : { background: '#fff!important' } }
            class={`
              ${styles[`${theme}Header`]}
              ${fixedHeader && globalScroll ? styles.fixedHeader : ''}
            `}>
            <Icon
              title="切换"
              class={styles.trigger}
              type={deviceType === 'mobile' ? 'menu' : collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={() => this.toggleSiderMenuCollapsed(deviceType)} />
              {
                deviceType === 'desktop'
                ? <TabTool
                  deviceType={deviceType}
                  mode={tabMode}
                  navLayout={navLayout}
                  show={tabTool} />
                : null
              }
            <RightBox deviceType={deviceType} />
          </header>
          : <header
            style={ navLayout === 'top' && !globalScroll ? { position: 'relative' } : {} }
            class={`
              ${styles[`${theme}Header`]}
              ${fixedHeader && globalScroll ? styles.fixedHeader : ''}
            `}>
            <Logo type="top" theme={theme} />
            <div class={styles.navTop}>
              <SiderMenu
                top
                theme={theme}
                open={open}
                menu={menuTree}
                tabActive={tabActive}
                class={`${styles.siderMenu} ${styles.siderMenuTop} ${theme === 'dark' ? styles.siderMenuTopDark : ''}`}
                openSiderSubMenu={this.openSiderSubMenu} />
            </div>
            <RightBox
              top
              theme={theme}
              deviceType={deviceType} />
          </header>
        }
        <main
          class={`
            ${navLayout === 'top' && deviceType === 'desktop' ? styles.contentTopNav : ''}
            ${fixedHeader && globalScroll ? styles.paddingTopHeader : ''}
            ${navLayout === 'top' && fixedHeader ? styles.topNavOwnerScroll : ''}
          `}>
          {
            navLayout === 'top'
            && deviceType === 'desktop'
            ? <TabTool
              deviceType={deviceType}
              mode={tabMode}
              navLayout={navLayout}
              show={tabTool} />
            : deviceType !== 'desktop'
            ? <TabManager
              menuCollapsed={collapsed}
              deviceType={deviceType} /> : null
          }
          <div style={{ height: 'inherit', overflowX: 'hidden' }}>
            <transition name="router-fade">
                <router-view></router-view>
            </transition>
          </div>
        </main>
      </section>
    </section>
  }
}
