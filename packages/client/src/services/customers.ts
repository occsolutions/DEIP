
import Services from './base-services'

const service = new Services('customers')

export default {
  shortListWithEnterprises: () => {
    return service.suiteOperation(() => service.get('short-list-with-enterprises'))
  },
  requestProduct: (message: string, product: string) => {
    return service.suiteOperation(() => service.post('request-product', { message, product }))
  }
}
