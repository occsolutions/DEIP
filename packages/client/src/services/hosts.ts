
import Services from './base-services'

const service = new Services('hosts')

export default {
  getAll: () => {
    return service.get('/')
  },
  getOne: (product: string) => {
    return service.get(`one/${product}`)
  }
}
