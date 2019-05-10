import { Component, Vue } from 'vue-property-decorator'
import { Row, Col, Avatar } from 'ant-design-vue'
import { State } from 'vuex-class'

import { loginInfo } from '@/store/types'

import avatar from '@/assets/avatar.png'
import styles from './index.less'

@Component
export default class Home extends Vue {
  @State('loginInfo') loginInfo!: loginInfo;
  protected render() {
    return <div class={styles.home}>
      <div class={styles.header}>
        <div class={styles.headerInfo}>
          <div class={styles.userInfo}>
            <div class={styles.avatar}>
              <Avatar size={72} src={avatar} />
            </div>
            <div class={styles.des}>
              <h3>您好，{this.loginInfo.nickname}</h3>
              <p>前端工程师 | 蚂蚁金服-某某事业部</p>
            </div>
          </div>
          <div class={styles.extraContent}>
            <Row>
              <Col span="8" class={styles.number}>
                <p>项目数</p>
                <div>56</div>
              </Col>
              <Col span="8" class={styles.number}>
                <p>团队内排名</p>
                <div>8/<span>24</span></div>
              </Col>
              <Col span="8" class={styles.number}>
                <p>项目访问</p>
                <div>2,234</div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <div class={styles.content}>
        Content
      </div>
    </div>
  }
}
