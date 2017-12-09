import { Module } from 'vuex';

import getters from './user.getters';
import mutations from './user.mutations';

export interface IState {
  alias: string;
}

export const state: IState = {
  alias: ''
};

export const MODULE_NAME: string = 'user';

const userModule: any = {
  [MODULE_NAME]: {
    state,
    getters,
    mutations
  } as Module<IState, any>
};

export default userModule;
