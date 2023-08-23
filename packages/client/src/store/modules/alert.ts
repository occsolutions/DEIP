
import ICommit from '../contracts/commit'

interface IMutations {
  type: any;
  message: any;
}

const baseState = {
  show: false,
  color: '',
  message: ''
}

const actions = {
  success ({ commit }: ICommit, message: any) {
    commit('alert', { type: 'success', message })
  },
  error ({ commit }: ICommit, message: any) {
    commit('alert', { type: 'error', message })
  },
  warning ({ commit }: ICommit, message: any) {
    commit('alert', { type: 'warning', message })
  }
}

const mutations = {
  alert (state: any, { type, message }: IMutations) {
    state.show = true
    state.color = type
    state.message = message
  }
}

export default {
  namespaced: true,
  state: baseState,
  actions,
  mutations
}
