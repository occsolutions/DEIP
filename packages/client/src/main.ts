
import Vue from 'vue'
import VueI18n from 'vue-i18n'
// import '@babel/polyfill'
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import App from './App.vue'
import router from './router'
import store from './store'
import registerComponents from './components'
import registerFilters from './filters'
import registeri18n from './i18n'
import registerInterceptors from './interceptor'
import registerValidators from './validators'

import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

registerFilters(Vue)
registerComponents(Vue)
registerInterceptors()

Vue.use(VueI18n)
// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'es',
  messages: registeri18n
})
registerValidators(Vue)

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App)
}).$mount('#app')
