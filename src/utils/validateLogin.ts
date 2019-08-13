import { loginInfo, routesInfoMap } from '@/store/types'

export default (
  store: { state: { loginInfo: loginInfo, routesInfoMap: routesInfoMap } },
  router: { beforeEach: Function }) => {
  router.beforeEach(
    (
      newpath: { [prospName: string]: any },
      _oldpath: { [prospName: string]: any },
      next: Function
    ) => {
      if (
        store.state.routesInfoMap[newpath.name]
        && !store.state.routesInfoMap[newpath.name].public
        // 满足已登录的条件，如必须具备token
        && !store.state.loginInfo.token
      ) return next({
        name: 'login'
      })
      // 自vuex取权限列表，对进入的路由进行权限验证,将未具有权限路由的请求跳转至404页面(可根据具体情况提示无权限)
      const auth: Array<string> = store.state.loginInfo.auth || []
      if (
        newpath.name !== 'login'
        && !auth.includes(newpath.name) && newpath.name !== 'notfound') return next({
        name: 'notfound'
      })
      next()
    }
  )
}
