import { EventEmitter } from 'events';
import { SignalingChannel } from '@/app/core/peer-connection/signaling-channel';
import {
  ISessionDescriptionIncomingEvent,
  PeerConnection,
  PeerConnectionType
} from '@/app/core/peer-connection/peer-connection';
import { trace } from '@/app/utils';
import { IPeerData } from 'src/app/core/peer-connection/peer-list';
import { DataChannel } from '@/app/core/peer-connection/data-channel';

export type PeerConnectionServiceEventType = 'connection';
export type PeerConnectionServiceEventPayload = PeerConnection;

export class PeerConnectionService
  extends EventEmitter<PeerConnectionServiceEventType, PeerConnectionServiceEventPayload> {

  private pcs: Map<string, PeerConnection> = new Map();

  constructor(private signalingChannel: SignalingChannel) {
    super();
  }

  public init() {

    // SessionDescription received
    this.signalingChannel.on('sdp', (data: ISessionDescriptionIncomingEvent) => this.onRemoteSessionDescription(data));

  }

  public destroy() {

    this.pcs.forEach((pc: PeerConnection) => pc.destroy());

  }

  public async initDataConnection(to: IPeerData): Promise<DataChannel> {

    return new Promise<DataChannel>((resolve) => {

      const peerConnection = new PeerConnection(this.signalingChannel);
      this.pcs.set(to.alias, peerConnection);

      peerConnection.on('data', (dataChannel: DataChannel) => resolve(dataChannel));
      peerConnection.initConnection(to, PeerConnectionType.Data);

    });

  }

  private async onRemoteSessionDescription(sdpEvent: ISessionDescriptionIncomingEvent): Promise<void> {

    trace('Remote SPD obtained', sdpEvent.from);
    // trace('Remote SPD obtained: \n' + (sdpEvent ? sdpEvent : '(null)'));

    if (sdpEvent.description.type === 'offer') {

      const accepted: boolean = confirm(`New connection requested from ${sdpEvent.from.alias}`);

      if (accepted) {

        const peerConnection = new PeerConnection(this.signalingChannel);
        this.emit('connection', peerConnection);

        return peerConnection.onRemoteSessionDescription(sdpEvent);

      }

    } else if (sdpEvent.description.type === 'answer') {

      const peerConnection: PeerConnection | undefined = this.pcs.get(sdpEvent.from.alias);

      if (peerConnection) {

        return peerConnection.onRemoteSessionDescription(sdpEvent);

      }

    }

    return Promise.resolve();

  }

}
