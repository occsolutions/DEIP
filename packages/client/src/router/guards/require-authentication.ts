
import store from '../../store'

export default (to: any, from: any, next: any) => {
  const redirectSuite = () => store.dispatch('session/getSuiteWebHost')
    .then((res) => {
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
        if (store.state.session.user.role === 'customer' && store.state.session.user.customer && store.state.session.user.customer.type === 'commercial' &&
          !store.state.session.user.enterprise) {
          next('/invalid-enterprise')
          return
        }
        if (store.state.session.user.role === 'customer' && store.state.session.user.customer) {
          let hasProduct = false
          for (const customerProduct of store.state.session.user.customer.products) {
            if (customerProduct.productId === 8) {
              hasProduct = true
            }
          }
          if (!hasProduct) {
            next('/ask-product')
            return
          }
        }
        next()
      } else {
        store.dispatch('session/signOut')
          .then(() => {
            redirectSuite()
          })
      }
    })
}
