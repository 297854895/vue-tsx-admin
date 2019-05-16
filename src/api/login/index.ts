import {
  loginInfo
} from '@/mock/login'

// 登录请求
const login = async (params: { [x: string]: any }) => {
  // axios.get('/xxxx')
  await new Promise(reslove => {
    setTimeout(reslove, 1500)
  })
  if (
    params.username && (params.username !== 'admin'
    || params.password !== 'admin')
  ) return 'accountLoginError'
  if (params.phone && params.captcha !== '000000') return 'phoneLoginError'
  return loginInfo
}

export default {
  login
}
