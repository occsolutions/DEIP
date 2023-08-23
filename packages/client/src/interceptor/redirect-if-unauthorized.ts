
import { AxiosError, AxiosResponse } from 'axios'

import router from '../router'
import store from '../store'

export default {
  success: (config: AxiosResponse) => config,
  error: (err: AxiosError) => {
    if (err.response && err.response.status === 409) {
      store.dispatch('session/update')
      return Promise.reject(err)
    }
    if (JSON.parse(JSON.stringify(err)).message === 'Request failed with status code 401') {
      store.dispatch('alert/error', 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.')
      store.dispatch('session/signOut')
        .then(() => router.push(''))
    }
    if (err.response && err.response.status === 401) {
      if (err.response && err.response.data.code === 'auth/expired-token') {
        store.dispatch('alert/error', 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.')
        store.dispatch('session/signOut')
          .then(() => router.push('/auth/sign-in'))
      } else if (err.response && err.response.data.code === 'auth/invalid-token') {
        window.location.reload(false)
      }
    }

    return Promise.reject(err)
  }
}
