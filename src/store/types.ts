export type languageType = 'zh-CN' | 'zh-TW' | 'en-US';

export interface languageOption {
  name: string;
  key: string;
}

export interface language {
  current: languageType,
  list: Array<languageOption>;
}

export interface menuItem {
  id: string;
  icon?: string | undefined;
  path?: string;
  children?: Array<menuItem>;
}

export interface routeItem {
  id: string;
  name: string;
  icon?: string;
  path: string;
  module?: Array<string>;
  children?: Array<routeItem>;
  public?: boolean | undefined;
  mutiTab?: boolean | undefined;
  [propsName: string]: any;
}

export interface tabItem {
  id: string;
  state?: { [propsName: string]: any };
  module?: Array<string>;
  keyPath: string
}

export interface routesInfoMap {
  [propsName: string]: {
    module?: Array<string>,
    public?: boolean;
  }
}

export interface siderMenu {
  collapsed: boolean;
  open: []
}

export interface loginInfo {
  [propsName: string]: any;
}

export interface rememberLoginInfo{
  account: string;
  password: string;
}

export type localStoreType = 'systemLocalStore' | 'routerLocalStore'

export type deviceType = 'desktop' | 'mobile' | 'tablet';

export type theme = 'dark' | 'light';

export type navLayout = 'left' | 'top';

export type tabMode = 'scroll' | 'compact'; // 滚动 or 紧凑

export interface RootState {
  theme: theme;
  version: string;
  themeColor: string;
  language: language;
  siderMenu: siderMenu;
  menuTree: Array<menuItem>;
  fixedHeader: boolean;
  tabTool: boolean;
  tabMode: tabMode;
  tabHistory: Array<string>;
  tabActive: string;
  tabList: Array<tabItem>;
  navLayout: navLayout;
  globalScroll: boolean;
  deviceType: deviceType;
  fixedLeftMenu: boolean;
  systemLocalStore: boolean;
  routerLocalStore: boolean;
  routesInfoMap: routesInfoMap;
  loginInfo: loginInfo;
  rememberMe: boolean;
  rememberLoginInfo: rememberLoginInfo | null
}
