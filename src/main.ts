import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './style/reset.css'
import axios from 'axios'
// import iView from 'iview';
// import 'iview/dist/styles/iview.css';
// import './unit/decorator'
// Vue.use(iView);  

Vue.prototype.$axios = axios;

new Vue({
  el: '#root',
  router,
  render: h => h(App)
})