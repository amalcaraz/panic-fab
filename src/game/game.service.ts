import { CardService } from '@/card/card.service';
import { DiceService } from '@/dice/dice.service';
import { Game } from '@/game/game.model';
import { Dice } from '@/dice/dice.model';
import { Card } from '@/card/card.model';

export class GameService {
  constructor(public cardService: CardService,
              public diceService: DiceService) {
  }

  public getGame(): Game {
    return new Game(
      this.getCards(),
      this.getDices()
    );
  }

  private getCards(): Card[] {
    return this.cardService.getCards();
  }

  private getDices(): Dice[] {
    return this.diceService.getDices();
  }

}
