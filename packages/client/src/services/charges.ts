
import Services from './base-services'

const service = new Services('charges')

export default {
  fetchByEnterprise: () => {
    return service.suiteOperation(() => service.get('list-by-enterprise'))
  }
}
