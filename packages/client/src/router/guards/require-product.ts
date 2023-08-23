
import store from '../../store'

export default (to: any, from: any, next: any) => {
  if (store.state.session && store.state.session.token) {
    if (store.state.session.user.role === 'customer' && store.state.session.user.customer) {
      let hasProduct = false
      for (const customerProduct of store.state.session.user.customer.products) {
        if (customerProduct.productId === 5) {
          hasProduct = true
        }
      }
      if (!hasProduct) {
        next()
        return
      }
      next('/dashboard')
    }
  }
}
