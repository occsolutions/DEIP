
import Services from './base-services'

const service = new Services('additional-segmentation')

export default {
  list: () => {
    return service.suiteOperation(() => service.get('list-by-enterprise'))
  },
  listActive: () => {
    return service.suiteOperation(() => service.get('list-active-by-enterprise'))
  },
  // Currently unused by client (running async by api worker)
  saveEmployeeDetail: (detailId: number, employeeEnterpriseId: number) => {
    return service.suiteOperation(() => service.post(`save-employee-detail/${detailId}/${employeeEnterpriseId}`))
  }
}
