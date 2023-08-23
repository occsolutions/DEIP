
import Services from './base-services'

const service = new Services('dashboard')

export default {
  getInfo: () => {
    return service.get('get-info')
  },
  getEmployeeInfo: (employeeId: number) => {
    return service.post('get-employee-info', { employeeId })
  },
  getEnterpriseInfo: () => {
    return service.get('get-enterprise-info')
  }
}
