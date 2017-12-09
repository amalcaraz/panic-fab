import Vue from 'vue';
import Vuex from 'vuex';
import config from 'config';

import userModule from './modules/user/user.module';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: config.env !== 'production',
  modules: {
    ...userModule
  }
});
