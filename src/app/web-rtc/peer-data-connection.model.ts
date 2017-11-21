import 'webrtc-adapter';
import io from 'socket.io-client';

import { trace } from '@/app/utils';
import { DataChannel, IDataChannelClass } from '@/app/web-rtc/data-channel.model';
import { IPeerData, PeerList } from '@/app/web-rtc/peer-list.model';
// import { EventEmitter } from 'events';

export interface ISessionDescriptionIncomingEvent {
  from: IPeerData;
  description: RTCSessionDescriptionInit;
}

export interface ISessionDescriptionOutgoingEvent {
  to: IPeerData;
  description: RTCSessionDescription;
}

export class PeerDataConnection {

  public peerList: PeerList;

  private pc: RTCPeerConnection;
  private socket: SocketIOClient.Socket;
  private dataChannels: DataChannel[] = [];
  private pendingRemoteIceCandidates: RTCIceCandidateInit[] = [];

  constructor(public alias: string,
              private CustomDataChannel: IDataChannelClass = DataChannel) {

    this.initSignAlignStuff();
  }

  public async initDataTransmission(to: IPeerData): Promise<void> {

    this.createDataChannel(`${this.alias}-${to.alias}`);
    return this.createOffer(to);

  }

  public destroy() {

    this.socket.close();
    this.removeAllDataChannels();
    this.pc.close();

  }

  private initSignAlignStuff(): void {

    const config: RTCConfiguration = {
      iceServers: [
        {urls: 'stun:stun.l.google.com:19302'}
      ]
    };
    this.pc = new RTCPeerConnection(config);
    trace('Created local peer connection object localConnection');

    // TODO: Remove hardcoded host and port and put it in a config file
    this.socket = io.connect('http://localhost:3000/signaling');
    this.socket.on('connect', () => {
      this.socket.emit('login', {alias: this.alias});
      trace('Created socket connection');
    });

    this.peerList = new PeerList(this.socket);

    // Remote DataChannel received
    this.pc.ondatachannel = (dataChanel: RTCDataChannelEvent) => this.onRemoteDataChannel(dataChanel);

    // Remote Ice candidate received
    this.socket.on('ice-candidate', (data: RTCIceCandidateInit) => this.onRemoteIceCandidate(data));

    // Local Ice candidate discovered
    this.pc.onicecandidate = (data: RTCPeerConnectionIceEvent) => this.onIceCandidate(data);

    // SessionDescription received
    this.socket.on('sdp', (data: ISessionDescriptionIncomingEvent) => this.onRemoteSessionDescription(data));

  }

  // Ice candidates

  private onRemoteIceCandidate(candidate: RTCIceCandidateInit) {

    trace('Remote ICE candidate obtained: \n' + (candidate ? candidate.candidate : '(null)'));

    if (this.isRemoteSessionDescriptionSet()) {

      this.addIceCandidate(candidate);

    } else {

      this.pendingRemoteIceCandidates.push(candidate);

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

  private onIceCandidate(event: RTCPeerConnectionIceEvent) {

    if (event.candidate) {

      this.socket.emit('ice-candidate', event.candidate);
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

  private onRemoteDataChannel(dataChanelEvent: RTCDataChannelEvent) {

    this.dataChannels.push(this.CustomDataChannel.createDataChannel(dataChanelEvent.channel));
    trace("Data Channel Error:", dataChanelEvent);

  }

  // SessionDescriptions

  private async onRemoteSessionDescription(sdpEvent: ISessionDescriptionIncomingEvent): Promise<void> {

    trace('Remote SPD obtained: \n' + (sdpEvent ? sdpEvent : '(null)'));

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

    this.socket.emit('sdp', {to, description} as ISessionDescriptionOutgoingEvent);
    trace('New session description sent: \n' + (description.sdp ? description.sdp : '(null)'));

  }

  private async setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void> {

    await this.pc.setRemoteDescription(new RTCSessionDescription(description));
    trace('setRemoteDescription: \n' + description.sdp);

    this.addPendingRemoteIceCandidates();

  }

}
