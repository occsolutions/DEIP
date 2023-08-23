
import ICommit from '../contracts/commit'

interface IDisplay {
  title: string;
  text: string;
  required?: string;
  isRequired?: boolean;
}

const baseState = {
  show: false,
  title: '',
  text: ''
}

const actions = {
  display ({ commit }: ICommit, data: IDisplay) {
    commit('display', data)
  },
  hide ({ commit }: ICommit) {
    commit('hide')
  }
}

const mutations = {
  display (state: any, data: any) {
    state.show = true
    state.title = data.title
    state.text = data.text
    if (data.isRequired) {
      state.text = `${state.text} ${data.required}`
    }
  },
  hide (state: any) {
    state.show = false
    state.title = ''
    state.text = ''
  }
}

export default {
  namespaced: true,
  state: baseState,
  actions,
  mutations
}
