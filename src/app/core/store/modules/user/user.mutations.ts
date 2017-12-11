import { IState } from './user.module';
import { SET_ALIAS, SetAlias, SET_STATE, SetState } from './user.mutation-types';

const userMutations: any = {
  [SET_ALIAS]: (state: IState, {payload}: SetAlias) => {
    state.alias = payload;
  },
  [SET_STATE]: (state: IState, {payload}: SetState) => {
    state.state = payload;
  }
};

export default userMutations;
