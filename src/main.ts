import Vue from 'vue';
import App from './app/app.component.vue';
import router from './app/router/index';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: (h) => h(App)
});
