import { Component, Vue, Prop } from 'vue-property-decorator'
import { State } from 'vuex-class'
import { Menu, Icon } from 'ant-design-vue'

import { menuItem, deviceType } from '@/store/types'

const { Item, SubMenu } = Menu

@Component
export default class SiderMenu extends Vue {
  @State(state => state.language.current) readonly currentLanguage!: string;
  @Prop(String) readonly theme!: string;
  @Prop(String) readonly tabActive!: string;
  @Prop(Array) readonly menu!: Array<menuItem>;
  @Prop(Array) readonly open!: [];
  @Prop(Boolean) readonly top!: boolean;
  @Prop(Boolean) readonly collapsed!: boolean;
  @Prop(String) readonly deviceType!: deviceType;
  @Prop(Function) readonly closeMenu!: Function;
  @Prop(Function) readonly openSiderSubMenu!: Function;
  createMenuItem(menu: Array<menuItem>): Array<JSX.Element> {
    const {
      $locale,
      currentLanguage
    } = this
    return menu.map((item: menuItem) => (
      item.children && item.children.length > 0
      ? <SubMenu key={item.id}>
        <span slot="title">
          {
            item.icon ? <Icon type={item.icon} /> : null
          }
          <span>{$locale[currentLanguage].menu[item.id]}</span>
        </span>
        {
          this.createMenuItem(item.children)
        }
      </SubMenu>
      : <Item
        title={$locale[currentLanguage].menu[item.id]}
        key={item.id}>
        {
          item.icon ? <Icon type={item.icon} /> : null
        }
        <span>{$locale[currentLanguage].menu[item.id]}</span>
      </Item>
    ))
  }
  opereateMenu(menuInfo: { keyPath: Array<string>, key: string }): void {
    // 路由跳转
    this.$router.push(`/${menuInfo.keyPath.reverse().join('/')}`)
    if (this.deviceType === 'mobile') this.closeMenu()
  }
  render () {
    const {
      collapsed,
      tabActive,
      theme,
      menu,
      open,
      top
    } = this
    return !top ? <Menu
      inlineCollapsed={collapsed}
      onClick={this.opereateMenu}
      onOpenChange={this.openSiderSubMenu}
      openKeys={open}
      selectedKeys={[tabActive]}
      mode="inline"
      theme={theme}>
      {
        menu && menu.length !== 0
        ? this.createMenuItem(menu)
        : null
      }
    </Menu>
    : <Menu
      onClick={this.opereateMenu}
      onOpenChange={this.openSiderSubMenu}
      openKeys={open}
      selectedKeys={[tabActive]}
      mode="horizontal"
      theme={theme}>
      {
        menu && menu.length !== 0
        ? this.createMenuItem(menu)
        : null
      }
    </Menu>
  }
}
