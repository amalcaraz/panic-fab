import { IState } from './user.module';
import { SET_ALIAS, SetAlias } from './user.mutation-types';

const userMutations: any = {
  [SET_ALIAS]: (state: IState, {payload}: SetAlias) => {
    state.alias = payload;
  }
};

export default userMutations;
