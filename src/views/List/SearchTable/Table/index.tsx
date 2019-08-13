import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import { Table } from 'ant-design-vue'

import styles from './index.less'

@Component
export default class TableData extends Vue {
  @Prop(Object) locale: { [x: string]: string };
  @Prop(Array) data: Array<any>;
  @Prop(Number) size: number;
  @Prop(Number) currentPage: number;
  @Prop(Number) total: number;
  @Prop(Boolean) loading: boolean;
  @Emit()
  private pagechange(page: number) { return page }
  private createHead() {
    return [
      {
        title: this.locale.name,
        dataIndex: 'name'
      },
      {
        title: this.locale.gender,
        dataIndex: 'gender',
        customRender: (gender: number) => gender === 0 ? this.locale.man : this.locale.woman
      },
      {
        title: this.locale.age,
        dataIndex: 'age'
      }
    ]
  }
  protected render() {
    return <div class={styles.table}>
      <Table
        rowKey="key"
        pagination={{
          pageSize: this.size,
          current: this.currentPage,
          total: this.total,
          onChange: this.pagechange
        }}
        loading={this.loading}
        dataSource={this.data}
        columns={this.createHead()} />
    </div>
  }
}
