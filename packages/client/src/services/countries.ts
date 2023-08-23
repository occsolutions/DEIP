
import Services from './base-services'

const service = new Services('countries')

export default {
  listByEnterprise: () => {
    return service.suiteOperation(() => service.get('list-by-enterprise'))
  }
}
