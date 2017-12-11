import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { IPeerData } from './peer-list.model';
import { getColorFromString, getLetterFromString } from '@/app/utils';

@Component
export default class PeerListComponent extends Vue {

  @Prop()
  private me: IPeerData;

  @Prop()
  private peers: IPeerData[];

  public onSelectedPeer(peer: IPeerData) {

    this.$emit('selectedPeer', peer);

  }

   public getColorFromString(str: string): string {

    return getColorFromString(str);

  }

  public getLetterFromString(str: string): string {

    return getLetterFromString(str);

  }

}
