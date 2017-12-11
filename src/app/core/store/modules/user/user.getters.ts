import { IState } from './user.module';
import { UserState } from './user.model';

export const GET_ALIAS = 'USER::GET_ALIAS';
export const GET_STATE = 'USER::GET_STATE';

const userGetters: any =  {
  [GET_ALIAS](state: IState, getters: any): string {
    return state.alias;
  },
  [GET_STATE](state: IState, getters: any): UserState {
    return state.state;
  }
};

export default userGetters;
