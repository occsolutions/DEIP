
import ICommit from '../contracts/commit'

const baseState = {
  show: false
}

const actions = {
  show ({ commit }: ICommit) {
    commit('show')
  },
  hide ({ commit }: ICommit) {
    commit('hide')
  }
}

const mutations = {
  show (state: any) {
    state.show = true
  },
  hide (state: any) {
    state.show = false
  }
}

export default {
  namespaced: true,
  state: baseState,
  actions,
  mutations
}
