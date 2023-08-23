
import Services from './base-services'

const service = new Services('identify-types')

export default {
  list: () => {
    return service.suiteOperation(() => service.get('list'))
  }
}
