import Services from './base-services'

const service = new Services('time-zones')

export default {
  list: () => {
    return service.suiteOperation(() => service.get('list'))
  }
}
