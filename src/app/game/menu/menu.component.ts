import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import { IMenuItem } from '@/app/game/menu/menu.model';

@Component
export default class MenuComponent extends Vue {

  private items: IMenuItem[] = [
    {label: 'New game', value: 1},
  ];

  public onClick(item: IMenuItem) {

    this.$emit('newGame');

  }

}
