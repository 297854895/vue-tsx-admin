import { RootState } from '@/store/types'
import themeColor from '@/config/themeColor'

export default (store: { state: RootState }): void => {
  const themeCSS = document.createElement('style'),
        colorInfo = themeColor.find(item => item.key === store.state.themeColor),
        color = colorInfo ? colorInfo.color : '#1890FF'
  themeCSS.innerHTML = `
    /** 初始化主题色设置 **/
    .system-theme-default-color {
      color: ${color}!important;
    }
    .system-theme-color:hover {
      color: ${color}!important;
    }
    .system-theme-color:hover {
      color: ${color}!important;
    }
    .system-theme-background {
      background-color: ${color}!important;
    }
    .system-theme-border {
      border-color: ${color}!important;
    }
  `
  document.getElementsByTagName('head')[0].appendChild(themeCSS)
}
