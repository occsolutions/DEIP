
import { AxiosError, AxiosRequestConfig } from 'axios'

import store from '../store'

export default {
  success: (config: AxiosRequestConfig) => {
    const token = store.state.session.token
    if (token != null) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error: (err: AxiosError) => Promise.reject(err)
}
