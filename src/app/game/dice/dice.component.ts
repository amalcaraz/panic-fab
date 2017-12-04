import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { ColorDice, Dice, FabDice, PatternDice, ShapeDice } from './dice.model';
import { IVueClassBindItemObj } from '@/app/utils';

@Component({})
export default class DiceComponent extends Vue {

  @Prop()
  private dice: Dice;

  get _class(): Array<IVueClassBindItemObj | string> {

    const classes: Array<IVueClassBindItemObj | string> = [{
      'dice--color': this.dice instanceof ColorDice,
      'dice--shape': this.dice instanceof ShapeDice,
      'dice--pattern': this.dice instanceof PatternDice,
      'dice--fab': this.dice instanceof FabDice
    }];

    if (this.dice instanceof ColorDice) {

      classes.push(`dice--color--${this.dice.currentFace}`);

    } else if (this.dice instanceof ShapeDice) {

      classes.push(`dice--shape--${this.dice.currentFace}`);

    } else if (this.dice instanceof PatternDice) {

      classes.push(`dice--pattern--${this.dice.currentFace}`);

    } else if (this.dice instanceof FabDice) {

      classes.push(`dice--fab--color-${this.dice.currentFace.type}`);
      classes.push(`dice--fab--direction-${this.dice.currentFace.direction}`);

    }

    return classes;

  }

}
