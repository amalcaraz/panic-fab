import { ColorDice, Dice, FabDice, PatternDice, ShapeDice } from '@/dice/dice.model';

export class DiceService {

  public getDices(): Dice[] {

    const dices: Dice[] = [
      new ColorDice(),
      new ShapeDice(),
      new PatternDice(),
      new FabDice()
    ];

    this.rollDices(dices);

    return dices;

  }

  private rollDices(dices: Dice[]): Dice[] {

    dices.forEach((dice: Dice) => dice.roll());
    return dices;

  }

}
