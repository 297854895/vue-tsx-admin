import { loginInfo, routesInfoMap } from '@/store/types'

export default (
  store: { state: { loginInfo: loginInfo, routesInfoMap: routesInfoMap } },
  router: { beforeEach: Function }) => {
  router.beforeEach(
    (
      newpath: { [prospName: string]: any },
      _oldpath: any,
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
      next()
    }
  )
}
