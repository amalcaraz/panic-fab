import { UserState } from 'src/app/core/store/modules/user/user.model';

export const SET_ALIAS = 'USER::SET_ALIAS';
export const SET_STATE = 'USER::SET_STATE';

export class SetAlias {
  public readonly type = SET_ALIAS;

  constructor(public payload: string) {
  }
}

export class SetState {
  public readonly type = SET_STATE;

  constructor(public payload: UserState) {
  }
}

export type MutationTypes = SetAlias | SetState;
