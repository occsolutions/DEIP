
import ICommit from '../contracts/commit'

const baseState = { data: null }

const actions = {
  set ({ commit }: ICommit, customer: any) {
    commit('setData', customer)
  },
  clear ({ commit }: ICommit) {
    commit('clearData')
  }
}

const mutations = {
  setData (state: any, customer: any) {
    state.data = customer
  },
  clearData (state: any) {
    state.data = null
  }
}

export default {
  namespaced: true,
  state: baseState,
  actions,
  mutations
}
