import { SignalingChannel } from '@/app/core/peer-connection/signaling-channel';
import { EventEmitter } from 'events';

export interface IPeerData {
  alias: string;
  rooms?: string[];
}

export type IPeerOutputEvents = 'peer-list-updated';

export class PeerList {

  public peers: IPeerData[] = [];
  private me: IPeerData = {
    alias: `peer-${Math.floor(Math.random() * 9999)}`
  };
  private output: EventEmitter = new EventEmitter();

  constructor(private signalingChannel: SignalingChannel) {
  }

  public async login(alias: string, rooms?: string[]): Promise<boolean> {

    this.logout();
    this.me = {alias, rooms};

    const output = new Promise<boolean>((resolve) => {

      const isItMe = (list: IPeerData[]) =>
        (list.some((peer: IPeerData) => peer.alias === this.me.alias)
          ? resolve(true)
          : resolve(false))
        && this.signalingChannel.off('peer-list', isItMe);

      this.signalingChannel.on('peer-list', isItMe);

    });

    this.initEvents();

    return output;

  }

  public logout() {

    this.signalingChannel.off('connect');
    this.signalingChannel.off('peer-list');
    this.signalingChannel.off('new-peer');
    this.signalingChannel.off('peer-disconnected');

  }

  private initEvents() {

    this.signalingChannel.on('connect', () => this.onConnect());
    this.signalingChannel.on('peer-list', (list: IPeerData[]) => this.onPeerList(list));
    this.signalingChannel.on('new-peer', (peer: IPeerData) => this.onNewPeer(peer));
    this.signalingChannel.on('peer-disconnected', (peer: IPeerData) => this.onPeerDisconnected(peer));

  }

  private onConnect() {

    this.signalingChannel.emit('login', this.me);

  }

  private onPeerList(peerList: IPeerData[]) {

    this.peers = peerList.filter((peer: IPeerData) => peer.alias !== this.me.alias);
    this.outputPeerListUpdate();

  }

  private onNewPeer(newPeer: IPeerData) {

    if (newPeer.alias !== this.me.alias) {

      this.peers.push(newPeer);
      this.outputPeerListUpdate();

    }

  }

  private onPeerDisconnected(disconnectedPeer: IPeerData) {

    this.peers = this.peers.filter((peer: IPeerData) => peer.alias !== disconnectedPeer.alias);
    this.outputPeerListUpdate();

  }

  private outputPeerListUpdate() {

    this.output.emit('peer-list-update', this.peers);

  }

}
