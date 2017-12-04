export const MODULE_NAME = 'user';
export const SET_ALIAS = 'SET_ALIAS';

export class SetAlias {
  public readonly type = `${MODULE_NAME}/${SET_ALIAS}`;

  constructor(public payload: string) {
  }
}

export type MutationTypes = SetAlias;
