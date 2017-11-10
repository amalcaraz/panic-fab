import { Card, FabCard, FabType } from '@/card/card.model';
import { ColorDice, Dice, FabDice, PatternDice, ShapeDice } from '@/dice/dice.model';

export class Game {

  constructor(public cards: Card[],
              public dices: Dice[]) {
  }

  public rollDices() {
    this.dices.forEach((dice: Dice) => dice.roll());
  }

  public findSeekedCard(): any {

    const fabDice: FabDice = this.dices.find((dice: Dice) => dice instanceof FabDice) as FabDice;
    const colorDice: ColorDice = this.dices.find((dice: Dice) => dice instanceof ColorDice) as ColorDice;
    const shapeDice: ShapeDice = this.dices.find((dice: Dice) => dice instanceof ShapeDice) as ShapeDice;
    const patternDice: PatternDice = this.dices.find((dice: Dice) => dice instanceof PatternDice) as PatternDice;

    const startPossition: number = this.findFabCardIndex(fabDice.currentFace);
  }

  private findFabCardIndex(fabType: FabType): number {
    return this.cards.findIndex((card: Card) => card instanceof FabCard && card.type === fabType);
  }

}
