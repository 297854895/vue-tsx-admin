import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import { Form, Input, Row, Col, Button, Select } from 'ant-design-vue'

import styles from './index.less'

@Component
class FilterBox extends Vue {
  form: object;
  @Prop(Object) locale: { [x: string]: string };
  @Prop(Object) formData: { [x: string]: any };
  @Emit() private search() {}
  @Emit() private reset() {}
  @Emit() private formchange(data: any) {
    return data
  }
  protected render() {
    const locale = this.locale
    return <div class={styles.box}>
      <Form>
        <Row>
          <Col span={6}>
            <Form.Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label={locale.name}>
              <Input onChange={(e: any) => this.formchange({ key: 'name', value: e.target.value })} placeholder={locale.inputName} value={this.formData.name} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label={locale.age}>
              <Input onChange={(e: any) => this.formchange({ key: 'age', value: e.target.value })} placeholder={locale.inputAge} value={this.formData.age} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              placeholder={locale.inputGender}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label={locale.gender}>
              <Select
                placeholder={locale.inputGender}
                onChange={(e: any) => this.formchange({ key: 'gender', value: e })}
                value={this.formData.gender}>
                <Select.Option value={-1}>
                  {locale.not}
                </Select.Option>
                <Select.Option value={0}>
                  {locale.man}
                </Select.Option>
                <Select.Option value={1}>
                  {locale.woman}
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button onClick={this.reset}>{locale.reset}</Button>
          <Button onClick={this.search} type="primary" style={{ marginLeft: '10px' }}>{locale.search}</Button>
        </Col>
      </Row>
    </div>
  }
}

export default Form.create({
  props: {
    locale: Object,
    formData: Object
  }
})(FilterBox)
