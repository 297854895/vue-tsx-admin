import { Component, Vue } from 'vue-property-decorator'
import { Button } from 'ant-design-vue'

import styles from './index.less'
import img from '@/assets/404.svg'
import defaultHomeKey from '@/config/default.homeKey'

@Component
export default class NotFound extends Vue {
  private backHome() {
    this.$router.push({
      name: defaultHomeKey
    })
  }
  protected render() {
    return <div class={styles.wrapper}>
      <div class={styles.left}>
        <img src={img} />
      </div>
      <div class={styles.right}>
        <h1>404</h1>
        <h4>抱歉，你访问的页面不存在</h4>
        <Button type="primary" onClick={this.backHome}>返回首页</Button>
      </div>
    </div>
  }
}
