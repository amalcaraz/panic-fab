import { Module } from 'vuex';

import getters from './user.getters';
import mutations from './user.mutations';
import { UserState } from './user.model';

export interface IState {
  alias: string;
  state: UserState;
}

export const state: IState = {
  alias: '',
  state: UserState.FREE
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
