
import { ACL, config } from '../libraries/acl'
import store from '../store'

const baseAcl = new ACL(config)

const acl = {
  can: (permssion: string) => {
    return baseAcl.can(permssion, store.state.session)
  }
}

const vueAcl = {
  install (vue: any) {
    vue.prototype.$can = acl.can
  }
}

export { acl, vueAcl as VueAcl }
