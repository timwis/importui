import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

import App from './App.vue'
import store from './store'

Vue.use(Buefy)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
