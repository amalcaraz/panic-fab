import 'tslib';
import Vue from 'vue';
import App from './app/app.component.vue';
import router from './app/router/index';
import store from './app/core/store/index';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
});
