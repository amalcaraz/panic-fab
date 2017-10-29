import { Card } from '@/card/card';
import { ColorDice, Dice, FabDice, PatternDice, ShapeDice } from '@/dice/dice';

export class Game {
  public cards: Card[];
  public dices: Dice[];

  constructor() {
    this.initGame();
  }

  public initGame() {
    this.dices = [
      new ColorDice(),
      new ShapeDice(),
      new PatternDice(),
      new FabDice()
    ];
  }

  public rollDices() {
    this.dices.forEach((dice: Dice) => dice.roll());
  }

}
