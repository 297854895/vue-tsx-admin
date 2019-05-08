import { Component, Vue } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'
import { LocaleProvider } from 'ant-design-vue'
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
import zh_TW from 'ant-design-vue/lib/locale-provider/zh_TW'
import en_US from 'ant-design-vue/lib/locale-provider/en_US'

import { DEVICE_TYPE, getDeviceType } from '@/utils/getDeviceType'
import { deviceType } from '@/store/types'

interface lanMap {
  [propName: string]: object
}

@Component
export default class App extends Vue {
  @Action('toggleDeviceType') toggleDeviceType: Function;
  @State(state => state.language.current) currentLocale: string;
  lanMap: lanMap = {
    'zh-CN': zh_CN,
    'zh-TW': zh_TW,
    'en-US': en_US
  }
  protected mounted() {
    // 启动用户设备响应式布局监听
    getDeviceType((type: deviceType) => {
      switch (type) {
        case DEVICE_TYPE.DESKTOP:
          this.toggleDeviceType(DEVICE_TYPE.DESKTOP)
          break
        case DEVICE_TYPE.TABLET:
          this.toggleDeviceType(DEVICE_TYPE.TABLET)
          break
        case DEVICE_TYPE.MOBILE:
          this.toggleDeviceType(DEVICE_TYPE.MOBILE)
        default:
          break
      }
    })
  }
  protected render() {
    return <LocaleProvider
      locale={this.lanMap[this.currentLocale]}>
      <router-view></router-view>
    </LocaleProvider>
  }
}
