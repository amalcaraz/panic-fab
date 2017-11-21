import 'webrtc-adapter';
import io from 'socket.io-client';

import { trace } from '@/app/utils';
import { DataChannel } from '@/app/web-rtc/data-channel.model';

export class WebRtcService {

  private pc: RTCPeerConnection;
  private dataChannels: DataChannel[];
  private socket: SocketIOClient.Socket;

  constructor() {

    this.initSignAlignStuff();

  }

  public initDataTransmission(from: string, to: string): void {

    this.createOffer();
    this.createDataChanel(`${from}-${to}`);

  }

  public destroy() {

    this.dataChannels.forEach((dc: DataChannel) => dc.destroy());
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
    this.socket = io.connect('http://0.0.0.0:3000/signaling');
    this.socket.on('connect', () => {
      this.socket.emit('login', `Alias-${Math.random() * 100}`);
    });
    trace('Created socket connection');

    // Remote Ice candidate received
    this.socket.on('ice-candidate', (data: RTCIceCandidate) => this.onRemoteIceCandidate(data));

    // Local Ice candidate discovered
    this.pc.onicecandidate = (e: RTCPeerConnectionIceEvent) => this.onIceCandidate(e);

    // SessionDescription received
    this.socket.on('sdp', (data: RTCSessionDescription) => this.onRemoteSessionDescription(data));

    // Remote DataChannel received
    this.pc.ondatachannel = (dataChanel: RTCDataChannelEvent) => this.onRemoteDataChannel(dataChanel);

  }

  // Ice candidates

  private onRemoteIceCandidate(candidate: RTCIceCandidate) {

    this.pc
      .addIceCandidate(candidate)
      .then(
        () => this.onAddIceCandidateSuccess(),
        (err: any) => this.onAddIceCandidateError(err)
      );

    trace('Remote ICE candidate obtained: \n' + (candidate ? candidate.candidate : '(null)'));

  }

  private onIceCandidate(event: RTCPeerConnectionIceEvent) {

    this.socket.emit('ice-candidate', event.candidate);
    trace('New ICE candidate sent: \n' + (event.candidate ? event.candidate.candidate : '(null)'));

  }

  private onAddIceCandidateSuccess() {
    trace('AddIceCandidate success.');
  }

  private onAddIceCandidateError(error: any) {
    trace('Failed to add Ice Candidate: ' + error.toString());
  }

  // DataChannels

  private createDataChanel(id: string): void {

    const dataChanel: DataChannel = new DataChannel(this.pc, id);
    this.dataChannels.push(dataChanel);

  }

  private removeDataChanel(id: string): void {

    this.dataChannels = this.dataChannels.filter((dc: DataChannel) => dc.id !== id);

  }

  private onRemoteDataChannel(dataChanel: RTCDataChannelEvent) {

    trace("Data Channel Error:", dataChanel);

  }

  // SessionDescriptions

  private onRemoteSessionDescription(description: RTCSessionDescription) {

    this.pc
      .setRemoteDescription(description)
      .then(
        () => this.onSetRemoteSessionDescriptionSuccess(),
        (err: any) => this.onSetRemoteSessionDescriptionError(err)
      )
      .then(() => this.createAnswer());

    trace('Remote ICE candidate obtained: \n' + (description ? description : '(null)'));

  }

  private onSetRemoteSessionDescriptionSuccess() {
    trace('setRemoteSessionDescription success.');
  }

  private onSetRemoteSessionDescriptionError(error: any) {
    trace('Failed to setRemoteSessionDescription : ' + error.toString());
  }

  private createAnswer() {

    this.pc
      .createAnswer()
      .then(
        (description: any) => this.onCreateAnswerSessionDescriptionSuccess(description),
        (error: any) => this.onCreateSessionDescriptionError(error)
      );

  }

  private createOffer() {

    this.pc
      .createOffer()
      .then(
        (description: any) => this.onCreateOfferSessionDescriptionSuccess(description),
        (error: any) => this.onCreateSessionDescriptionError(error)
      );

  }

  private onCreateOfferSessionDescriptionSuccess(description: RTCSessionDescription) {

    this.pc.setLocalDescription(description);
    trace('Offer from localConnection \n' + description.sdp);

    this.socket.emit('sdp', description);
    trace('New session description sent: \n' + (description.sdp ? description.sdp : '(null)'));

  }

  private onCreateSessionDescriptionError(error: any) {
    trace('Failed to create session description: ' + error.toString());
  }

  private onCreateAnswerSessionDescriptionSuccess(description: RTCSessionDescription) {

    this.pc.setLocalDescription(description);
    trace('Answer created remoteConnection \n' + description.sdp);

    this.socket.emit('sdp', description);

  }

}
