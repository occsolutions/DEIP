
import Services from './base-services'

const service = new Services('products')

export default {
  listActive: () => {
    return service.suiteOperation(() => service.get('list-active?ext=1'))
  },
  listByCustomer: () => {
    return service.suiteOperation(() => service.get('list-by-customer?ext=1'))
  }
}
