import { Module } from 'vuex';
import getters from './user.getters';
import mutations from './user.mutations';

export interface IState {
  alias: string;
}

export const state: IState = {
  alias: ''
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
} as Module<IState, any>;
