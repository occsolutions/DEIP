
import Services from './base-services'

const service = new Services('product-services')

export default {
  getOne: (name: string) => {
    return service.get(`find-by-name/${name}`)
  }
}
