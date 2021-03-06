import { IPeerData, PeerList } from '@/app/core/peer-connection/peer-list';
import { SignalingChannel } from '@/app/core/peer-connection/signaling-channel';
import { SingletonFactory } from '@/app/core/peer-connection/singleton';
import { PeerConnectionService } from '@/app/core/peer-connection/peer-conection.service';
import { DataChannel } from '@/app/core/peer-connection/data-channel';
import { PeerConnection } from '@/app/core/peer-connection/peer-connection';
import { EventEmitter } from 'events';

export class WebRtcService extends EventEmitter {

  public peerList: PeerList;
  private signalingChannel: SignalingChannel;
  private peerConnectionService: PeerConnectionService;

  constructor(public alias: string) {

    super();

    this.signalingChannel = SingletonFactory.getInstance(SignalingChannel);
    this.peerConnectionService = SingletonFactory.getInstance(PeerConnectionService, this.signalingChannel);
    this.peerList = SingletonFactory.getInstance(PeerList, this.signalingChannel);

    this.peerList
      .login(alias)
      .then(() => {

        this.peerConnectionService.on('connection', (peerConnection: PeerConnection) => {

          peerConnection.on('data', (dataChannel: DataChannel) => this.emit('data', dataChannel));

        });

        this.peerConnectionService.init();

      });

  }

  public async initDataTransmission(to: IPeerData): Promise<DataChannel> {

    return this.peerConnectionService.initDataConnection(to);

  }

  public destroy() {

    this.peerList.logout();
    this.peerConnectionService.destroy();

  }

}
