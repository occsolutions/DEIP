
import Services from './base-services'

const service = new Services('headquarters')

export default {
  list: (country: number) => {
    return service.suiteOperation(() => (service.get(`list?country=${country}`)))
  },
  fetchByEnterprise: () => {
    return service.suiteOperation(() => service.get('fetch-by-enterprise'))
  }
}
