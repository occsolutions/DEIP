
import Services from './base-services'

const service = new Services('employees')

export default {
  listActive: () => {
    return service.suiteOperation(() => service.get('participants-list'))
  },
  getDemographicParticipants: (data: object) => {
    return service.suiteOperation(() => service.post('by-demographic-filter', data))
  },
  getByCriteria: (data: object) => {
    return service.suiteOperation(() => service.get(`by-criteria?data=${JSON.stringify(data)}&selectionType=demographic_items`))
  }
}
