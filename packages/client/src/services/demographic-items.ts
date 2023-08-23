
import Services from './base-services'

const service = new Services('demographic-items')

export default {
  list: (lang: string) => {
    return service.suiteOperation(() => service.get('list', { params: { lang: lang } }))
  }
}
