import { AmoebaColorType, AmoebaPatternType, AmoebaShapeType, FabType } from '@/card/card';

export type DiceFace = any;

export class Dice {
  public currentFace: DiceFace;

  constructor(protected faces: DiceFace[]) {
    this.roll();
  }

  public roll() {
    const i: number = Math.floor(Math.random() * this.faces.length);
    this.currentFace = this.faces[i];
  }
}

export class ColorDice extends Dice {
  constructor(protected faces: number[] = Array.from({length: 6}, (v, i: number) => (i % 2) === 0
    ? AmoebaColorType.Color1
    : AmoebaColorType.Color2
  )) {
    super(faces);
  }
}

export class ShapeDice extends Dice {
  constructor(protected faces: number[] = Array.from({length: 6}, (v, i: number) => (i % 2) === 0
    ? AmoebaShapeType.Shape1
    : AmoebaShapeType.Shape2
  )) {
    super(faces);
  }
}

export class PatternDice extends Dice {
  constructor(protected faces: number[] = Array.from({length: 6}, (v, i: number) => (i % 2) === 0
    ? AmoebaPatternType.Pattern1
    : AmoebaPatternType.Pattern2
  )) {
    super(faces);
  }
}

export class FabDice extends Dice {
  constructor(protected faces: number[] = Array.from({length: 6}, (v, i: number) => {
    switch (i % 3) {
      case 0: return FabType.Fab1;
      case 1: return FabType.Fab2;
      default: return FabType.Fab3;
    }
  })) {
    super(faces);
  }
}
