
import store from '../../store'

export default async (to: any, from: any, next: any) => {
  const session = { token: '', user: null }
  if (to.query && to.query.ssoToken) {
    session.token = to.query.ssoToken
  }
  await store.dispatch('session/sso', session)

  if (store.state.session && store.state.session.user && store.state.session.token) {
    if (store.state.session.user.role === 'customer' && store.state.session.user.customer && store.state.session.user.customer.type === 'commercial' &&
      !store.state.session.user.enterprise) {
      next('/invalid-enterprise')
      return
    }
    next('/dashboard')
    return
  }
  store.dispatch('session/getSuiteWebHost')
    .then((res) => {
      if (res) {
        location.replace(`${res}/auth/sso?product=deip`)
      } else {
        next('/404')
      }
    })
}
