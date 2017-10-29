export enum AmoebaColorType {
  Color1,
  Color2
}

export enum AmoebaShapeType {
  Shape1,
  Shape2
}

export enum AmoebaPatternType {
  Pattern1,
  Pattern2
}

export enum FabType {
  Fab1,
  Fab2,
  Fab3
}

export class Card {
}

export class AmoebaCard extends Card {
  public color: AmoebaColorType;
  public shape: AmoebaShapeType;
  public pattern: AmoebaPatternType;

}

export class AirVentCard extends Card {}

export enum MutationRoomType {
}

export class MutationRoomCard extends Card {}
