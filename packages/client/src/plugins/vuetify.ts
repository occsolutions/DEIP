
import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '../assets/css/app.css'
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import es from 'vuetify/src/locale/es'

Vue.use(Vuetify, {
  iconfont: '[mdi, fa]',
  theme: {
    primary: '#1a98da',
    secondary: '#6290B5',
    tertiary: '#005ed9'
  }
})

export default new Vuetify({
  lang: {
    locales: { es },
    current: 'es'
  },
  icons: {
    iconfont: 'mdi'
  }
})
