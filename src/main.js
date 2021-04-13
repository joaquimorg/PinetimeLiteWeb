import Vue from 'vue'
import App from './App.vue'

import './assets/pinetime.css'

Vue.config.productionTip = false

//https://github.com/ankurk91/vue-toast-notification
import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import './registerServiceWorker'

Vue.use(VueToast, {
  // One of the options
  position: 'top'
})

new Vue({  
  render: h => h(App),
}).$mount('#app')
