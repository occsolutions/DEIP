
import store from '../../store'

export default (to: any, from: any, next: any) => {
  const redirectSuite = () => store.dispatch('session/getSuiteWebHost')
    .then((res: any) => {
      if (res) {
        location.replace(`${res}/auth/sso?product=deip`)
      } else {
        next('/404')
      }
    })

  if (!store.state.session.token) {
    redirectSuite()
    return
  }

  store.dispatch('session/isValid')
    .then((res) => {
      if (res) {
        if (store.state.session.user.role === 'admin') {
          next()
          return
        }
        next('/forbidden')
      } else {
        store.dispatch('session/signOut')
          .then(() => {
            redirectSuite()
          })
      }
    })
}
