import {
  adminAccount,
  testAccount,
  account
} from '@/mock/login'

import auth from '@/config/auth.config'

// 登录请求
const login = async (params: { [x: string]: any }) => {
  // axios.get('/xxxx')
  await new Promise(reslove => {
    setTimeout(reslove, 1500)
  })
  if (!account.hasOwnProperty(params.username) || params.password !== account[params.username]) return 'accountLoginError'
  if (params.phone && params.captcha !== '000000') return 'phoneLoginError'
  return params.username === 'admin'
         ? { ...adminAccount, auth, username: params.username }
         : params.username === 'test'
         ? { ...testAccount, auth, username: params.username }
         : null
}

export default {
  login
}
