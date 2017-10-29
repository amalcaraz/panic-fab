import Vue from 'vue';
import App from './app.vue';
import router from './router/index';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: (h) => h(App)
});
