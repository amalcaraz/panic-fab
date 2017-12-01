import 'webrtc-adapter';

import config from 'config';
import { SignalingChannel } from '@/app/core/peer-connection/signaling-channel';
import { trace } from '@/app/utils';
import { IPeerData } from '@/app/core/peer-connection/peer-list';
import { DataChannel, IDataChannelClass } from '@/app/core/peer-connection/data-channel';
import { EventEmitter } from 'events';

export enum PeerConnectionType {
  Data,
  Media,
  DataAndMedia
}

export interface IICECandidateIncomingEvent {
  from: IPeerData;
  candidate: RTCIceCandidateInit;
}

export interface IICECandidateOutgoingEvent {
  to: IPeerData;
  candidate: RTCIceCandidate;
}

export interface ISessionDescriptionIncomingEvent {
  from: IPeerData;
  description: RTCSessionDescriptionInit;
}

export interface ISessionDescriptionOutgoingEvent {
  to: IPeerData;
  description: RTCSessionDescription;
}

export type PeerConnectionEventType = 'data' | 'media';
export type PeerConnectionEventPayload = DataChannel;

export class PeerConnection extends EventEmitter<PeerConnectionEventType, PeerConnectionEventPayload> {

  private pc: RTCPeerConnection;
  private dataChannels: DataChannel[] = [];
  private pendingRemoteIceCandidates: RTCIceCandidateInit[] = [];

  constructor(private signalingChannel: SignalingChannel,
              private CustomDataChannel: IDataChannelClass = DataChannel) {

    super();

    const rtcConfig: RTCConfiguration = {
      iceServers: config.signalignSocket.ICEServers.map((iceServer: string) => ({urls: iceServer}))
    };
    this.pc = new RTCPeerConnection(rtcConfig);
    trace('Created local peer connection object localConnection');

    // Remote Ice candidate received
    this.signalingChannel.on('ice-candidate', (data: IICECandidateIncomingEvent) => this.onRemoteIceCandidate(data));

  }

  public async onRemoteSessionDescription(sdpEvent: ISessionDescriptionIncomingEvent): Promise<void> {

    trace('Remote SPD obtained', sdpEvent.from);
    // trace('Remote SPD obtained: \n' + (sdpEvent ? sdpEvent : '(null)'));

    await this.setRemoteDescription(sdpEvent.description);

    if (sdpEvent.description.type === 'offer') {

      // Remote DataChannel received
      this.pc.ondatachannel = (dataChanelEvent: RTCDataChannelEvent) => this.onRemoteDataChannel(dataChanelEvent);

      return await this.createAnswer(sdpEvent.from);

    }

  }

  public async initConnection(to: IPeerData, type = PeerConnectionType.Data, id: string = 'game'): Promise<void> {

    if (type === PeerConnectionType.Data || type === PeerConnectionType.DataAndMedia) {

      this.createDataChannel(id);

    }

    return this.createOffer(to);

  }

  public destroy() {

    this.removeAllDataChannels();
    this.pc.close();

  }

  // Ice candidates

  private onRemoteIceCandidate(candidateEvent: IICECandidateIncomingEvent) {

    // trace('Remote ICE candidate obtained: \n' + (candidateEvent ? candidateEvent.candidate.candidate : '(null)'));
    trace('Remote ICE candidate obtainer', candidateEvent.from);

    if (this.isRemoteSessionDescriptionSet()) {

      this.addIceCandidate(candidateEvent.candidate);

    } else {

      this.pendingRemoteIceCandidates.push(candidateEvent.candidate);

    }

  }

  private addPendingRemoteIceCandidates() {

    this.pendingRemoteIceCandidates.forEach((candidate: RTCIceCandidateInit) => this.addIceCandidate(candidate));

  }

  private async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {

    return this.pc
      .addIceCandidate(new RTCIceCandidate(candidate as RTCIceCandidateInit))
      .then(
        () => this.onAddIceCandidateSuccess(),
        (err: any) => this.onAddIceCandidateError(err)
      );

  }

  private sendIceCandidate(event: RTCPeerConnectionIceEvent, to: IPeerData) {

    if (event.candidate) {

      this.signalingChannel.emit('ice-candidate', {to, candidate: event.candidate} as IICECandidateOutgoingEvent);
      trace('New ICE candidate sent: \n' + (event.candidate ? event.candidate.candidate : '(null)'));

    }

  }

  private onAddIceCandidateSuccess() {
    trace('AddIceCandidate success.');
  }

  private onAddIceCandidateError(error: any) {
    trace('Failed to add Ice Candidate: ' + error.toString());
  }

  // DataChannels

  private createDataChannel(id: string): void {

    const dataChanel: DataChannel = this.CustomDataChannel.createDataChannel(undefined, id, this.pc);
    this.dataChannels.push(dataChanel);
    this.emit('data', dataChanel);

  }

  /*private removeDataChannel(id: string): void {

    const dataChanel: DataChannel | undefined = this.dataChannels.find((dc: DataChannel) => dc.id !== id);

    if (dataChanel) {

      dataChanel.destroy();
      this.dataChannels = this.dataChannels.filter((dc: DataChannel) => dc !== dataChanel);

    }

  }*/

  private removeAllDataChannels(): void {

    this.dataChannels.forEach((dc: DataChannel) => dc.destroy());

  }

  private onRemoteDataChannel(dataChanelEvent: RTCDataChannelEvent): DataChannel {

    const newDataChannel: DataChannel = this.CustomDataChannel.createDataChannel(dataChanelEvent.channel);
    this.dataChannels.push(newDataChannel);
    trace("Remote data channel added:", dataChanelEvent);

    this.emit('data', newDataChannel);
    return newDataChannel;

  }

  // SessionDescriptions

  private isRemoteSessionDescriptionSet(): boolean {
    return !!(this.pc.remoteDescription && this.pc.remoteDescription.sdp);
  }

  private async createAnswer(to: IPeerData): Promise<any> {

    const description: RTCSessionDescriptionInit = await this.pc.createAnswer() as RTCSessionDescriptionInit;
    return await this.setLocalDescriptionAndSendIt(description, to);

  }

  private async createOffer(to: IPeerData): Promise<void> {

    const description: RTCSessionDescriptionInit = await this.pc.createOffer() as RTCSessionDescriptionInit;
    return await this.setLocalDescriptionAndSendIt(description, to);

  }

  private async setLocalDescriptionAndSendIt(description: RTCSessionDescriptionInit, to: IPeerData): Promise<void> {

    // Local Ice candidate discovered
    this.pc.onicecandidate = (data: RTCPeerConnectionIceEvent) => this.sendIceCandidate(data, to);

    await this.pc.setLocalDescription(new RTCSessionDescription(description));
    trace('setLocalDescription: \n' + description.sdp);

    this.signalingChannel.emit('sdp', {to, description} as ISessionDescriptionOutgoingEvent);
    trace('New session description sent: \n' + (description.sdp ? description.sdp : '(null)'));

  }

  private async setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void> {

    await this.pc.setRemoteDescription(new RTCSessionDescription(description));
    trace('setRemoteDescription: \n' + description.sdp);

    this.addPendingRemoteIceCandidates();

  }

}
