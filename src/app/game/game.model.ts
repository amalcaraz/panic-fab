import * as shuffle from 'shuffle-array';

import {
  AirVentCard,
  AmoebaCard,
  AmoebaColorType,
  AmoebaPatternType,
  AmoebaShapeType,
  Card,
  DirectionType,
  FabCard,
  FabType,
  MutationRoomCard,
  MutationRoomType
} from '@/app/card/card.model';
import { ColorDice, Dice, FabDice, PatternDice, ShapeDice } from '@/app/dice/dice.model';
import { getEnumKeys } from '@/app/utils';
import { Timer } from '@/app/timer/timer.model';

export enum GameState {
  Finished,
  Paused,
  InProgress
}

export class Game {

  private static maxMutations: number = getEnumKeys(MutationRoomType).length + 1;
  private static gameTime: number = 60;

  public cards: Card[];
  public dices: Dice[];
  public timer: Timer;
  public state: GameState = GameState.Finished;

  private fabDice: FabDice;
  private colorDice: ColorDice;
  private shapeDice: ShapeDice;
  private patternDice: PatternDice;

  constructor(cards: Card[],
              dices: Dice[],
              timer: Timer) {

    this.cards = cards;
    this.dices = dices;
    this.timer = timer;

    this.fabDice = this.dices.find((dice: Dice) => dice instanceof FabDice) as FabDice;
    this.colorDice = this.dices.find((dice: Dice) => dice instanceof ColorDice) as ColorDice;
    this.shapeDice = this.dices.find((dice: Dice) => dice instanceof ShapeDice) as ShapeDice;
    this.patternDice = this.dices.find((dice: Dice) => dice instanceof PatternDice) as PatternDice;

  }

  public start() {

    this.rollDices();
    this.shuffleCards();
    this.timer.start(Game.gameTime);
    this.state = GameState.InProgress;

  }

  public pause() {

    this.timer.stop();
    this.state = GameState.Paused;

  }

  public resume() {

    this.timer.resume();
    this.state = GameState.InProgress;

  }

  public finish(winner: boolean) {

    this.pause();
    this.state = GameState.Finished;

    alert(winner ? 'Winner!' : 'Looser!');

  }

  public rollDices() {
    this.dices.forEach((dice: Dice) => dice.roll());
  }

  public shuffleCards() {
    shuffle(this.cards);
  }

  public checkWinerCard(card: Card | null): boolean {
    const winerCard: Card | null = this.findSearchedCard();
    return card === winerCard;
  }

  public findSearchedCard(): Card | null {

    this.resetSearchedCard();

    const startFabType: FabType = this.fabDice.currentFace.type;
    let searchedColor: AmoebaColorType = this.colorDice.currentFace;
    let searchedShape: AmoebaShapeType = this.shapeDice.currentFace;
    let searchedPattern: AmoebaPatternType = this.patternDice.currentFace;

    const startPosition: number = this.findFabCardIndex(startFabType);
    const startDirection: DirectionType = this.fabDice.currentFace.direction;
    const increment: number = startDirection === DirectionType.Right ? 1 : -1;

    let currentPosition: number = startPosition;
    let currentCard: Card | null = this.cards[startPosition];
    let mutationsCount: number = 0;

    while (!this.isSearchedCard(currentCard, searchedColor, searchedShape, searchedPattern)) {

      if (currentCard instanceof AirVentCard) {

        currentPosition = this.findNextAirVentCardIndex(currentPosition, increment);

      } else if (currentCard instanceof MutationRoomCard) {

        switch (currentCard.type) {

          case MutationRoomType.ColorMutationRoom:
            searchedColor = this.mutateColor(searchedColor);
            mutationsCount++;
            break;

          case MutationRoomType.ShapeMutationRoom:
            searchedShape = this.mutateShape(searchedShape);
            mutationsCount++;
            break;

          case MutationRoomType.PatternMutationRoom:
            searchedPattern = this.mutatePattern(searchedPattern);
            mutationsCount++;
            break;

        }

      }

      if (mutationsCount >= Game.maxMutations) {

        currentCard = null;

      } else {

        currentPosition = this.incrementPosition(currentPosition, increment);
        currentCard = this.cards[currentPosition];

      }

    }

    if (currentCard) {
      currentCard.isActive = true;
    }

    return currentCard;

  }

  public resetSearchedCard() {
    this.cards.forEach((card: Card) => card.isActive = false);
  }

  private isSearchedCard(card: Card | null,
                         searchedColor: AmoebaColorType,
                         searchedShape: AmoebaShapeType,
                         searchedPattern: AmoebaPatternType): boolean {

    return card === null || (
      card instanceof AmoebaCard
      && card.color === searchedColor
      && card.shape === searchedShape
      && card.pattern === searchedPattern
    );

  }

  private mutateColor(color: AmoebaColorType): AmoebaColorType {

    return color === AmoebaColorType.Color1
      ? AmoebaColorType.Color2
      : AmoebaColorType.Color1;

  }

  private mutateShape(shape: AmoebaShapeType): AmoebaShapeType {

    return shape === AmoebaShapeType.Shape1
      ? AmoebaShapeType.Shape2
      : AmoebaShapeType.Shape1;

  }

  private mutatePattern(pattern: AmoebaPatternType): AmoebaPatternType {

    return pattern === AmoebaPatternType.Pattern1
      ? AmoebaPatternType.Pattern2
      : AmoebaPatternType.Pattern1;

  }

  private incrementPosition(position: number, increment: number = 1) {
    const newPosition: number = (position + increment) % this.cards.length;
    return newPosition < 0 ? this.cards.length + newPosition : newPosition;
  }

  private findNextAirVentCardIndex(startPosition: number, increment: number = 1): number {

    for (let i = startPosition + increment; i !== startPosition; i = this.incrementPosition(i, increment)) {
      if (this.cards[i] instanceof AirVentCard) {
        return i;
      }
    }

    return startPosition;
  }

  private findFabCardIndex(fabType: FabType): number {
    return this.cards.findIndex((card: Card) => card instanceof FabCard && card.type === fabType);
  }

}
