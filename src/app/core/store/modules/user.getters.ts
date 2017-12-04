import { IState } from './user.module';

export default {
  getAlias(state: IState, getters: any): string {
    return state.alias;
  }
};
