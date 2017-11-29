import { IPeerData, PeerList } from '@/app/core/peer-list';
import { SignalingChannel } from '@/app/core/signaling-channel';
import { SingletonFactory } from '@/app/core/singleton';
import { PeerConnection, PeerConnectionType } from '@/app/core/peer-connection';

export class WebRtcService {

  public peerList: PeerList;
  private signalingChannel: SignalingChannel;
  private peerConnections: PeerConnection[] = [];

  constructor(public alias: string) {

    this.signalingChannel = SingletonFactory.getInstance(SignalingChannel);
    this.peerList = SingletonFactory.getInstance(PeerList, this.signalingChannel);

    this.peerList.login(alias);

    const newPeerConnection = new PeerConnection(PeerConnectionType.Data, this.signalingChannel);
    this.peerConnections.push(newPeerConnection);
    newPeerConnection.onDataConnection();

  }

  public async initDataTransmission(to: IPeerData): Promise<void> {

    const newPeerConnection = new PeerConnection(PeerConnectionType.Data, this.signalingChannel);
    this.peerConnections.push(newPeerConnection);
    newPeerConnection.initDataConnection(to);

  }

  public destroy() {

    this.peerList.logout();
    this.peerConnections.forEach((pc: PeerConnection) => pc.destroy());

  }

}
