
import Services from './base-services'

const service = new Services('sectors')

export default {
  list: () => {
    return service.suiteOperation(() => service.get('list'))
  }
}
