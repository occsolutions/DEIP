
import axios from 'axios'

import addToken from './add-token'
import redirectIfForbidden from './redirect-if-forbidden'
import redirectIfNotFound from './redirect-if-not-found'
import redirectIfUnauthorized from './redirect-if-unauthorized'

const resquestInterceptors = [
  addToken
]

const responseInterceptors = [
  redirectIfUnauthorized,
  redirectIfForbidden,
  redirectIfNotFound
]

export default () => {
  resquestInterceptors.forEach((interceptor) => {
    axios.interceptors.request.use(interceptor.success, interceptor.error)
  })

  responseInterceptors.forEach((interceptor) => {
    axios.interceptors.response.use(interceptor.success, interceptor.error)
  })
}
