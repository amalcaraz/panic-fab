import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { IPeerData } from "./peer-list.model";

@Component
export default class PeerListComponent extends Vue {

  @Prop()
  private peers: IPeerData[];

  public onSelectedPeer(peer: IPeerData) {

    this.$emit('selectedPeer', peer);

  }

}
