import Vue from 'vue';
import Vuex from 'vuex';
import config from 'config';
import userModule from './modules/user.module';
import { MODULE_NAME } from './modules/user.mutation-types';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: config.env !== 'production',
  modules: {
    [MODULE_NAME]: userModule
  }
});
