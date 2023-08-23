
import Services from './base-services'

const service = new Services('auth')

export default {
  signIn: (credentials: { email: string; password: string }) => {
    return service.post('login', credentials)
  },
  signOut: () => {
    return service.post('sign-out')
  },
  sso: () => {
    return service.get('sso')
  },
  isValid: () => {
    return service.get('validate')
  },
  identifyTypes: () => {
    return service.suiteOperation(() => service.get('list-identify-types'))
  },
  checkActivity: (id: number) => {
    return service.suiteOperation(() => service.get(`check-activity/${id}`))
  }
}
