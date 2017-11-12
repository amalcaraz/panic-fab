import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { AirVentCard, AmoebaCard, Card, FabCard, MutationRoomCard } from './card.model';
import { IVueClassBindItemObj } from '@/utils';

@Component
export default class CardComponent extends Vue {

  @Prop()
  private card: Card;

  get _class(): Array<IVueClassBindItemObj | string> {

    const classes: Array<IVueClassBindItemObj | string> = [{
      'card--air-vent': this.card instanceof AirVentCard,
      'card--amoeba': this.card instanceof AmoebaCard,
      'card--mutation-room': this.card instanceof MutationRoomCard,
      'card--fab': this.card instanceof FabCard
    }];

    if (this.card instanceof AmoebaCard) {

      classes.push(`card--amoeba--color-${this.card.color}`);
      classes.push(`card--amoeba--shape-${this.card.shape}`);
      classes.push(`card--amoeba--pattern-${this.card.pattern}`);

    } else if (this.card instanceof MutationRoomCard) {

      classes.push(`card--mutation-room--type-${this.card.type}`);

    } else if (this.card instanceof FabCard) {

      classes.push(`card--fab--type-${this.card.type}`);

    }

    return classes;

  }

  public onClick(): void {

    window.alert('hola');

  }
}
