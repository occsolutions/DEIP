
import Services from './base-services'

const service = new Services('academic-degrees')

export default {
  listFromSuite: () => {
    return service.suiteOperation(() => service.get('list'))
  },
  list: () => {
    return service.suiteOperation(() => service.get('list'))
  },
  listAll: () => {
    return service.suiteOperation(() => service.get('list-data'))
  }
}
