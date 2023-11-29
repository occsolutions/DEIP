
import Services from './base-services'

const service = new Services('charges')

export default {
  list: () => {
    return service.suiteOperation(() => service.get('list'))
  },
  fetchByEnterprise: () => {
    return service.suiteOperation(() => service.get('list-by-enterprise'))
  }
}
