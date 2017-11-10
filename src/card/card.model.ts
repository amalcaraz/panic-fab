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

export enum DirectionType {
  Left,
  Right,
}

export enum MutationRoomType {
  ColorMutationRoom,
  ShapeMutationRoom,
  PatternMutationRoom
}

export class Card {
}

export class AmoebaCard extends Card {
  constructor(public color: AmoebaColorType,
              public shape: AmoebaShapeType,
              public pattern: AmoebaPatternType) {
    super();
  }
}

export class FabCard extends Card {
  constructor(public type: FabType) {
    super();
  }
}

export class MutationRoomCard extends Card {
  constructor(public type: MutationRoomType) {
    super();
  }
}

export class AirVentCard extends Card {
}
