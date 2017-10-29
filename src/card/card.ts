export enum AmoebaColorType {
  Color1,
  Color2
}

export enum AmoebaColorShape {
  Shape1,
  Shape2
}

export enum AmoebaColorPattern {
  Pattern1,
  Pattern2
}

export class Card {
}

export class AmoebaCard extends Card {
  public color: AmoebaColorType;
  public shape: AmoebaColorShape;
  public pattern: AmoebaColorPattern;
}

export class AirVentCard extends Card {}

export enum MutationRoomType {
}

export class MutationRoomCard extends Card {}
