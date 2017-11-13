import { CardService } from '@/app/card/card.service';
import { DiceService } from '@/app/dice/dice.service';
import { Game } from '@/app/game/game.model';
import { Dice } from '@/app/dice/dice.model';
import { Card } from '@/app/card/card.model';
import { Timer } from '@/app/timer/timer.model';

export class GameService {
  constructor(public cardService: CardService,
              public diceService: DiceService) {
  }

  public getGame(): Game {
    return new Game(
      this.getCards(),
      this.getDices(),
      new Timer()
    );
  }

  private getCards(): Card[] {
    return this.cardService.getCards();
  }

  private getDices(): Dice[] {
    return this.diceService.getDices();
  }

}
