
import Services from './base-services'

const service = new Services('job-types')

export default {
  list: () => {
    return service.suiteOperation(() => service.get('list'))
  },
  listAll: () => {
    return service.suiteOperation(() => service.get('list-data'))
  }
}
