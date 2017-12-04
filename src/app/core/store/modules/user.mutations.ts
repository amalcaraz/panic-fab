import { IState } from './user.module';
import { SET_ALIAS } from './user.mutation-types';

const mutations = {
  [SET_ALIAS]: (state: IState, {payload}: any) => {
    state.alias = payload;
  }
};

export default mutations;
