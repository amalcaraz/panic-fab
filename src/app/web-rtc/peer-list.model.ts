export interface IPeerData {
  socketId: string;
  alias: string;
  rooms: string[];
}

export class PeerList {

  public peerList: IPeerData[] = [];

  constructor(private socket: SocketIOClient.Socket) {

    this.initEvents();

  }

  private initEvents() {

    this.socket.on('peer-list', (list: IPeerData[]) => this.onPeerList(list));
    this.socket.on('new-peer', (peer: IPeerData) => this.onNewPeer(peer));
    this.socket.on('peer-disconnected', (peer: IPeerData) => this.onPeerDisconnected(peer));

  }

  private onPeerList(peerList: IPeerData[]) {

    this.peerList = peerList;

  }

  private onNewPeer(newPeer: IPeerData) {

    this.peerList.push(newPeer);

  }

  private onPeerDisconnected(disconnectedPeer: IPeerData) {

    this.peerList = this.peerList.filter((peer: IPeerData) => peer.alias !== disconnectedPeer.alias);

  }

}
