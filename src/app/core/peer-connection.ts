import 'webrtc-adapter';

import config from 'config';
import { SignalingChannel } from '@/app/core/signaling-channel';
import { trace } from '@/app/utils';
import { IPeerData } from '@/app/core/peer-list';
import { DataChannel, IDataChannelClass } from '@/app/core/data-channel';

export enum PeerConnectionType {
  Data,
  Video
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

export class PeerConnection {

  private pc: RTCPeerConnection;
  private dataChannels: DataChannel[] = [];
  private pendingRemoteIceCandidates: RTCIceCandidateInit[] = [];

  constructor(private type: PeerConnectionType,
              private signalingChannel: SignalingChannel,
              private CustomDataChannel: IDataChannelClass = DataChannel) {

    this.init();

  }

  public init(): void {

    const rtcConfig: RTCConfiguration = {
      iceServers: config.signalignSocket.ICEServers.map((iceServer: string) => ({urls: iceServer}))
    };
    this.pc = new RTCPeerConnection(rtcConfig);
    trace('Created local peer connection object localConnection');

  }

  public onDataConnection(fn?: (dataChannel: DataChannel) => any) {

    // Remote Ice candidate received
    this.signalingChannel.on('ice-candidate', (data: IICECandidateIncomingEvent) => this.onRemoteIceCandidate(data));

    // SessionDescription received
    this.signalingChannel.on('sdp', (data: ISessionDescriptionIncomingEvent) => this.onRemoteSessionDescription(data));

    if (this.type === PeerConnectionType.Data) {

      // Remote DataChannel received
      this.pc.ondatachannel = (dataChanel: RTCDataChannelEvent) => this.onRemoteDataChannel(dataChanel, fn);
    }

  }

  public async initDataConnection(to: IPeerData): Promise<void> {

    this.onDataConnection();

    // Local Ice candidate discovered
    this.pc.onicecandidate = (data: RTCPeerConnectionIceEvent) => this.onIceCandidate(data, to);

    this.createDataChannel(`${to.alias}`);
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

  private onIceCandidate(event: RTCPeerConnectionIceEvent, to: IPeerData) {

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

  private onRemoteDataChannel(dataChanelEvent: RTCDataChannelEvent, fn: any) {

    const newDataChannel = this.CustomDataChannel.createDataChannel(dataChanelEvent.channel);
    this.dataChannels.push(newDataChannel);
    trace("Remote data channel added:", dataChanelEvent);
    fn(newDataChannel);

  }

  // SessionDescriptions

  private async onRemoteSessionDescription(sdpEvent: ISessionDescriptionIncomingEvent): Promise<void> {

    trace('Remote SPD obtained', sdpEvent.from);
    // trace('Remote SPD obtained: \n' + (sdpEvent ? sdpEvent : '(null)'));

    await this.setRemoteDescription(sdpEvent.description);

    if (sdpEvent.description.type === 'offer') {

      return await this.createAnswer(sdpEvent.from);

    }

  }

  private isRemoteSessionDescriptionSet(): boolean {
    return !!(this.pc.remoteDescription && this.pc.remoteDescription.sdp);
  }

  private async createAnswer(to: IPeerData): Promise<any> {

    const description: RTCSessionDescriptionInit = await this.pc.createAnswer() as RTCSessionDescriptionInit;
    return await this.setLocalDescription(description, to);

  }

  private async createOffer(to: IPeerData): Promise<void> {

    const description: RTCSessionDescriptionInit = await this.pc.createOffer() as RTCSessionDescriptionInit;
    return await this.setLocalDescription(description, to);

  }

  private async setLocalDescription(description: RTCSessionDescriptionInit, to: IPeerData): Promise<void> {

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
