
import Vue from 'vue'
import Vuex from 'vuex'

import alert from './modules/alert'
import customer from './modules/customer'
import help from './modules/help'
import loading from './modules/loading'
import session from './modules/session'

Vue.use(Vuex)

// give a type to store.state, so tscompiler is pleased
// we must add all new modules as properties in state's type
const state: {
  session?: any;
  alert?: any;
} = {}

export default new Vuex.Store({
  state,
  modules: {
    alert,
    customer,
    help,
    loading,
    session
  }
})
