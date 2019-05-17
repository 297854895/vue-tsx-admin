import { Row, Col, Avatar, Card, Icon, Tag } from 'ant-design-vue'
import { Component, Vue } from 'vue-property-decorator'
import { State, namespace } from 'vuex-class'
import G2 from '@antv/g2'

import { loginInfo } from '@/store/types'
import { programStatisItem, teamItem, momentItem } from '@/store/models/home/types'

import avatar from '@/assets/avatar.png'
import styles from './index.less'

const homemodule = namespace('home')

@Component
export default class Home extends Vue {
  chart: any = null;
  @State('loginInfo') loginInfo!: loginInfo;
  @homemodule.Action('getProgramStatis') getProgramStatis: Function;
  @homemodule.Action('getTeam') getTeam: Function;
  @homemodule.Action('getMoment') getMoment: Function;
  @homemodule.State('programStatis') programStatis: Array<programStatisItem>;
  @homemodule.State('moment') moment: Array<momentItem>;
  @homemodule.State('team') team: Array<teamItem>;
  protected mounted() {
    this.getProgramStatis()
    this.getMoment()
    this.getTeam()
    this.$nextTick(() => {
      this.$nextTick(() => this.initRadar())
    })
  }
  initRadar() {
    const data = [
      { genre: 'Sports', sold: 195 },
      { genre: 'Strategy', sold: 115 },
      { genre: 'Action', sold: 120 },
      { genre: 'Shooter', sold: 200 },
      { genre: 'Other', sold: 150 }
    ]
    const chart = new G2.Chart({
      container: (this.$refs.radar as HTMLDivElement),
      forceFit: true,
      height: 300,
      padding: [20, 0, 90, 30]
    });
    chart.source(data)
    chart.interval().position('genre*sold').color('genre')
    chart.render()
    this.chart = chart
  }
  protected render() {
    const {
      programStatis,
      moment,
      team
    } = this
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
        <Row>
          <Col class={styles.contentPadding} span="16">
            <Row>
              <Col class={styles.contentMargin}>
                <Card
                  class={styles.card}
                  loading={!programStatis}
                  title="进行中的项目">
                  <a href="" slot="extra">全部项目</a>
                  {
                    programStatis
                    ? programStatis.map(item => <Card.Grid
                      class={styles.programStatis}
                      key={item.id}>
                      <h5>
                        <Icon type={item.icon} />&nbsp;&nbsp;{item.title}
                      </h5>
                      <p>
                        {item.content}
                      </p>
                      <p>
                        {item.team}
                        <span>{item.time}</span>
                      </p>
                    </Card.Grid>)
                    : <Card.Grid>loading</Card.Grid>
                  }
                </Card>
              </Col>
              <Col class={styles.contentMargin}>
                <Card
                  loading={!moment}
                  title="动态">
                  {
                    moment
                    ? moment.map(item => <Card.Grid
                      class={styles.moment}
                      key={item.id}>
                      <Avatar size={48} src={avatar} />
                      <span>
                        {item.name}
                        <span>{item.des}</span>
                        <span>{item.time}</span>
                      </span>
                    </Card.Grid>)
                    : <Card.Grid>loading</Card.Grid>
                  }
                </Card>
              </Col>
            </Row>
          </Col>
          <Col class={styles.contentPadding} span="8">
            <Row>
              <Col class={styles.contentMargin}>
                <Card
                  class="system-theme-default-color"
                  title="快速开始">
                  <Tag>操作一</Tag>
                  <Tag>操作二</Tag>
                  <Tag >操作三</Tag>
                  <Tag>操作四</Tag>
                </Card>
              </Col>
              <Col
                class={styles.contentMargin}>
                <Card
                  style={{ overflow: 'hidden' }}
                  title="指数">
                  <div ref="radar"></div>
                </Card>
              </Col>
              <Col>
                <Card
                  loading={!team}
                  title="团队">
                  {
                    team
                    ? team.map(item => <Card.Grid class={styles.teamCard}>
                      <Icon type={item.icon} />&nbsp;&nbsp;{item.team}
                    </Card.Grid>)
                    : <Card.Grid>loading</Card.Grid>
                  }
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  }
}
