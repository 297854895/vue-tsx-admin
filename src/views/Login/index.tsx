import { Form, Input, Icon, Checkbox, Button, Tabs, Row, Col, Dropdown, Menu } from 'ant-design-vue'
import { Component, Vue } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'

import { language } from '@/store/types'

import styles from './index.less'
import logo from '@/assets/logo.svg'
import defaultHomeKey from '@/config/default.homeKey'

import crypto from '@/utils/crypto'

@Component({
  props: {
    form: {
      type: Object
    }
  }
})
class Login extends Vue {
  form: any;
  loginType: string = 'account';
  btnLoading: boolean = false;
  phoneLoginState: {
    time: number;
    loginBtn: boolean;
    smsSendBtn: boolean
  } = {
    time: 60,
    loginBtn: false,
    smsSendBtn: false
  }
  // 语言信息
  @State(state => state.language) language !: language;
  // 是否记住密码
  @State(state => state.rememberMe) rememberMeChecked!: boolean;
  // 记住的用于登录信息
  @State(state => state.rememberLoginInfo) rememberLoginInfo!: { account: string; password: string };
  // 切换语言
  @Action('toggleLanguage') toggleLanguage : Function;
  @Action('toggleRmemberMe') toggleRmemberMe : Function;
  @Action('login') login !: Function;
  protected mounted() {
    if (this.rememberMe) {
      let { account, password } = this.rememberLoginInfo || { account: '', password: '' }
      if (!account || !password) return
      try {
        password = crypto.decrypt(password)
        this.form.setFieldsValue({
          username: account,
          password
        })
      } catch(e) {
        console.error(e)
      }
    }
  }
  async handleSubmit(event: Event) {
    event.preventDefault()
    const { form: { validateFields }, loginType } = this
    validateFields(async (err: string, value: any) => {
      if (!err) {
        let loginInfo: { [propsName: string]: string } = {}
        if (loginType === 'account') {
          // 账号密码登录
          loginInfo.username = value.username
          loginInfo.password = value.password
        } else {
          // 手机号登录
          loginInfo.phone = value.phone
          loginInfo.captcha = value.captcha
        }
        this.btnLoading = true
        const res = await this.login(loginInfo)
        this.btnLoading = false
        if (res && typeof res === 'string') return this.$message.error(this.$locale[this.language.current].login[res])
        this.$router.push({
          name: defaultHomeKey
        })
      }
    })
  }
  toggleLoginType(loginType: string) {
    if (this.btnLoading) return
    this.loginType = loginType
  }
  getCaptcha(event: Event) {
    event.preventDefault()
    this.$message.success(this.$locale[this.language.current].login.captcha)
    // const { form: { validateFields }, phoneLoginState } = this
    // validateFields(['phone'], { force: true }, (err: any, values: any) => {
    // })
  }
  rememberMe(e: { target: { checked: boolean } }) {
    this.toggleRmemberMe(e.target.checked)
    if (!e.target.checked) this.form.setFieldsValue({
      username: '',
      password: ''
    })
  }
  protected render() {
    const { getFieldDecorator } = this.form,
          {
            $locale,
            language,
            loginType,
            btnLoading,
            getCaptcha,
            handleSubmit,
            phoneLoginState,
            toggleLoginType,
            rememberMeChecked
          } = this,
          locale = $locale[language.current].login
    return <div class={styles.login}>
    <Dropdown trigger={['click']}>
      <span
        style={{ position: 'absolute', right: '20px', top: '10px' }}
        class="system-theme-color">
        <Icon type="global" />
      </span>
      <Menu slot="overlay">
        {
          language.list.map(item => {
            return <Menu.Item
              onClick={() => this.toggleLanguage(item.key)}
              key={item.key}>
              <span class={styles.menuItem}>{item.name}</span>
            </Menu.Item>
          })
        }
      </Menu>
    </Dropdown>
      <Form
        class={styles.loginForm}
        onSubmit={(event: Event) => handleSubmit(event)}>
        <h1 class={styles.header}>
          <img src={logo} />
          Vue Tsx Admin
        </h1>
        <Tabs
          activeKey={loginType}
          tabBarStyle={{ textAlign: 'center', borderBottom: 'unset' }}
          onChange={(type: string) => toggleLoginType(type)}>
          <Tabs.TabPane key="account" tab={locale.account}>
            <Form.Item>
              {
                getFieldDecorator('username', { rules: [{ required: loginType === 'account', message: locale.accountError }] })(
                  <Input size="large" type="text" name="username" placeholder={locale.accountTip}>
                    <Icon slot="prefix" type="user" />
                  </Input>
                )
              }
            </Form.Item>
            <Form.Item>
              {
                getFieldDecorator('password', { rules: [{ required: loginType === 'account', message: locale.passwordError  }] })(
                  <Input size="large" type="password" name="password" placeholder={locale.passwordTip}>
                    <Icon slot="prefix" type="lock" />
                  </Input>
                )
              }
            </Form.Item>
          </Tabs.TabPane>
          <Tabs.TabPane key="phone" tab={locale.phone}>
            <Form.Item>
              {
                getFieldDecorator('phone', { rules: [{ required: loginType === 'phone', pattern: /^1[34578]\d{9}$/, message: locale.phoneError }], validateTrigger: 'change' })(
                  <Input size="large" type="text" name="phone" placeholder={locale.phoneTip}>
                    <Icon slot="prefix" type="mobile" />
                  </Input>
                )
              }
            </Form.Item>
            <Row gutter={16}>
              <Col class="gutter-row" span={16}>
                <Form.Item>
                  {
                    getFieldDecorator('captcha', { rules: [{ required: loginType === 'phone', message: locale.captchaError }], validateTrigger: 'blur' })(
                      <Input size="large" type="text" placeholder={locale.captcha} name="captcha">
                        <Icon slot="prefix" type="mail" />
                      </Input>
                    )
                  }
                </Form.Item>
              </Col>
              <Col class="gutter-row" span={8}>
                <Button
                  class={styles.getCaptcha}
                  tabindex="-1"
                  disabled={phoneLoginState.smsSendBtn}
                  onClick={(event: Event) => getCaptcha(event)}>
                  {!phoneLoginState.smsSendBtn && locale.getCaptcha || (`${phoneLoginState.time} s`)}
                </Button>
              </Col>
            </Row>
          </Tabs.TabPane>
       </Tabs>
       <Form.Item>
         {
           loginType === 'account'
           ? <Checkbox
              checked={rememberMeChecked}
              onChange={this.rememberMe}>
                {locale.saveAccount}
             </Checkbox>
           : null
         }
         <a class={styles.loginFormForgot} href="">
           {locale.forgotPassword}
         </a>
         <Button
           loading={btnLoading}
           type="primary"
           html-type="submit"
           class={styles.loginFormButton}>
           {locale.login}
         </Button>
         <a href="">{locale.register}</a>
       </Form.Item>
      </Form>
    </div>
  }
}
export default Form.create({})(Login)
