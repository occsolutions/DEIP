
import ICommit from '../contracts/commit'

import auth from '../../services/auth'
import hosts from '../../services/hosts'

const TOKEN_KEY = 'occ-key-token'
const USER_KEY = 'occ-key-user'

const baseState = {
  user: JSON.parse(localStorage.getItem(USER_KEY) || '{}'),
  token: localStorage.getItem(TOKEN_KEY)
}

const persistAndCommitSession = (commit: any, session: any) => {
  localStorage.setItem(TOKEN_KEY, session.token)
  localStorage.setItem(USER_KEY, JSON.stringify(session.user))

  commit('setSession', session)
  return session
}
const persistAndCommitUser = (commit: any, session: any) => {
  localStorage.setItem(USER_KEY, JSON.stringify(session.user))
  commit('setUser', session)
  return session
}
const actions = {
  signIn ({ commit }: ICommit, credentials: any) {
    return auth.signIn(credentials)
      .then((session) => persistAndCommitSession(commit, session))
  },
  signOut ({ commit }: ICommit) {
    return auth.signOut()
      .then(() => {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        commit('clearSession')
      })
  },
  sso ({ commit }: ICommit, session: any) {
    persistAndCommitSession(commit, session)
    return auth.sso()
      .then((res: any) => {
        if (!res.id) {
          localStorage.removeItem(TOKEN_KEY)
          localStorage.removeItem(USER_KEY)

          commit('clearSession')
          return
        }
        session.user = res
        persistAndCommitSession(commit, session)
      })
  },
  update ({ commit }: ICommit) {
    return auth.sso()
      .then((res: any) => {
        if (!res.id) {
          localStorage.removeItem(TOKEN_KEY)
          localStorage.removeItem(USER_KEY)
          commit('clearSession')
          return
        }
        const session = { user: res }
        persistAndCommitUser(commit, session)
      })
  },
  isValid () {
    return auth.isValid()
      .catch(err => {
        if (err) return false
      })
  },
  getDeipHost () {
    return hosts.getOne('deip')
      .catch(err => {
        if (err) return false
      })
  },
  getSuiteHost () {
    return hosts.getOne('suite')
      .catch(err => {
        if (err) return false
      })
  },
  getSuiteWebHost () {
    return hosts.getOne('suite')
      .then(res => {
        if (res && res.clientUrl) {
          let urlSuite = res.clientUrl
          if (res.clientPort && (res.clientPort !== 80 && res.clientPort !== 443)) {
            urlSuite = `${urlSuite}:${res.clientPort}`
          }
          return urlSuite
        }
      })
      .catch(err => {
        if (err) return false
      })
  }
}

const mutations = {
  setSession (state: any, session: any) {
    state.user = session.user
    state.token = session.token
  },
  setUser (state: any, session: any) {
    state.user = session.user
  },
  clearSession (state: any) {
    state.user = {}
    state.token = null
  }
}

export default {
  namespaced: true,
  state: baseState,
  actions,
  mutations
}
