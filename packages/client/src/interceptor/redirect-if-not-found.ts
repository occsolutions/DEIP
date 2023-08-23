
import { AxiosError, AxiosResponse } from 'axios'

import router from '../router'

export default {
  success: (config: AxiosResponse) => config,
  error: (err: AxiosError) => {
    if (err.response && err.response.status === 404) {
      router.replace('/404')
    }

    return Promise.reject(err)
  }
}
