
import { AxiosError, AxiosResponse } from 'axios'

import router from '../router'

export default {
  success: (config: AxiosResponse) => config,
  error: (err: AxiosError) => {
    if (err.response && err.response.status === 403) {
      router.replace('/forbidden')
    }

    return Promise.reject(err)
  }
}
