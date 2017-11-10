import * as shuffle from 'shuffle-array';
import {
  AirVentCard,
  AmoebaCard,
  AmoebaColorType,
  AmoebaPatternType,
  AmoebaShapeType,
  Card,
  FabCard,
  FabType,
  MutationRoomCard,
  MutationRoomType
} from '@/card/card.model';
import { getCombinations, getEnumKeys, getEnumValues } from '@/utils';

export class CardService {

  public getCards(): Card[] {

    const cards: Card[] = [
      ...this.getAirVentCards(),
      ...this.getFabCards(),
      ...this.getMutationRoomCards(),
      ...this.getAmoebaCards()
    ];

    this.shuffleCards(cards);

    return cards;

  }

  private getAirVentCards(): AirVentCard[] {
    return Array.from({length: 3}, () => new AirVentCard());
  }

  private getFabCards(): AirVentCard[] {
    return Array.from(getEnumKeys(FabType), (v: any, t: FabType) => new FabCard(t));
  }

  private getMutationRoomCards(): AirVentCard[] {
    return Array.from(getEnumKeys(MutationRoomType), (v: any, t: MutationRoomType) => new MutationRoomCard(t));
  }

  private getAmoebaCards(): AmoebaCard[] {
    const colors: AmoebaColorType[] = getEnumValues(AmoebaColorType);
    const shapes: AmoebaShapeType[] = getEnumValues(AmoebaShapeType);
    const patterns: AmoebaPatternType[] = getEnumValues(AmoebaPatternType);

    return getCombinations(
      [colors, shapes, patterns],
      (c, s, p) => new AmoebaCard(c, s, p)
    );

    /*return colors
      .reduce((prevColor: AmoebaCard[], currColor: AmoebaColorType) => prevColor
          .concat(shapes.reduce((prevShape: AmoebaCard[], currShape: AmoebaShapeType) => prevShape
              .concat(patterns.reduce((prevPattern: AmoebaCard[], currPattern: AmoebaPatternType) => prevPattern
                  .concat()
                , []))
            , []))
        , []);*/
  }

  private shuffleCards(cards: Card[]): Card[] {
    return shuffle(cards);
  }

}
