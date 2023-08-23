
import Services from './base-services'

const service = new Services('enterprises')

export default {
  getProfile () {
    return service.suiteOperation(() => service.get('profile-by-id'))
  }
}
