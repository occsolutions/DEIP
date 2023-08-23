
import store from '../../store'

export default (to: any, from: any, next: any) => {
  if (store.state.session && store.state.session.token) {
    if (['customer', 'enterprise_admin'].includes(store.state.session.user.role) &&
      store.state.session.user.customer &&
      store.state.session.user.customer.type === 'commercial' &&
      !store.state.session.user.enterprise
    ) {
      next()
    } else {
      next('/dashboard')
    }
  }
}
