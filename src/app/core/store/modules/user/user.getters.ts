import { IState } from './user.module';

export const GET_ALIAS = 'USER::GET_ALIAS';

const userGetters: any =  {
  [GET_ALIAS](state: IState, getters: any): string {
    return state.alias;
  }
};

export default userGetters;
