export const SET_ALIAS = 'USER::SET_ALIAS';

export class SetAlias {
  public readonly type = SET_ALIAS;

  constructor(public payload: string) {
  }
}

export type MutationTypes = SetAlias;
