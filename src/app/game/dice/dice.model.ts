import * as shuffle from 'shuffle-array';
import {
  AmoebaColorType, AmoebaPatternType, AmoebaShapeType, DirectionType, FabType
} from '@/app/game/card/card.model';
import { getCombinations, getEnumValues } from '@/app/utils';

export type DiceFace = any;

export interface IFabDiceFace {
  type: FabType;
  direction: DirectionType;
}

export class Dice {
  public currentFace: DiceFace;

  constructor(protected faces: DiceFace[]) {
    this.roll();
  }

  public roll() {
    this.currentFace = shuffle.pick(this.faces);
  }
}

export class ColorDice extends Dice {

  public currentFace: AmoebaColorType;

  constructor(protected faces: AmoebaColorType[] = Array.from({ length: 6 }, (v, i: number) => (i % 2) === 0
    ? AmoebaColorType.Color1
    : AmoebaColorType.Color2
  )) {
    super(faces);
  }
}

export class ShapeDice extends Dice {

  public currentFace: AmoebaShapeType;

  constructor(protected faces: AmoebaShapeType[] = Array.from({ length: 6 }, (v, i: number) => (i % 2) === 0
    ? AmoebaShapeType.Shape1
    : AmoebaShapeType.Shape2
  )) {
    super(faces);
  }
}

export class PatternDice extends Dice {

  public currentFace: AmoebaPatternType;

  constructor(protected faces: AmoebaPatternType[] = Array.from({ length: 6 }, (v, i: number) => (i % 2) === 0
    ? AmoebaPatternType.Pattern1
    : AmoebaPatternType.Pattern2
  )) {
    super(faces);
  }
}

export class FabDice extends Dice {

  public currentFace: IFabDiceFace;

  constructor(protected faces: IFabDiceFace[] = getCombinations(
    [getEnumValues(FabType), getEnumValues(DirectionType)],
    (type, direction) => ({ type, direction } as IFabDiceFace)
  )) {
    super(faces);
  }
}

/*
export class FabDice extends Dice {
  constructor(protected faces: IFabDiceFace[] = Array.from({length: 6}, (v, i: number) => {
    switch (i % 3) {
      case 0:
        return FabType.Fab1;
      case 1:
        return FabType.Fab2;
      default:
        return FabType.Fab3;
    }
  })) {
    super(faces);
  }
}
*/
