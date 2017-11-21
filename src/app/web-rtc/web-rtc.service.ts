import 'webrtc-adapter';
import io from 'socket.io-client';

export function trace(...arg: any[]) {
  const now = (window.performance.now() / 1000).toFixed(3);
  console.log(now + ': ', arg);
}

export class WebRtcService {

  private pc: RTCPeerConnection;
  private dataChannel: RTCDataChannel;
  private socket: SocketIOClient.Socket;

  public initDataTransmition(): void {

    this.initSignAlignStuff();
    this.createDataChanel();
    this.createOffer();

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
    this.socket = io('http://localhost:3000');
    trace('Created socket connection');

    // Remote Ice candidate received
    this.socket.on('ice-candidate', (data: RTCIceCandidate) => this.onRemoteIceCandidate(data));

    // Local Ice candidate discovered
    this.pc.onicecandidate = (e: RTCPeerConnectionIceEvent) => this.onIceCandidate(e);

    // SessionDescription received
    this.socket.on('sdp', (data: RTCSessionDescription) => this.onRemoteSessionDescription(data));

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

  private createDataChanel(id: string = 'defaultDataChannel'): void {

    const config: RTCDataChannelInit = {};
    this.dataChannel = this.pc.createDataChannel(id, config);
    trace('Created send data channel');

    this.dataChannel.onopen = () => this.onDataChannelOpen();
    this.dataChannel.onclose = () => this.onDataChannelClose();
    this.dataChannel.onerror = (error: ErrorEvent) => this.onDataChannelError(error);
    this.dataChannel.onmessage = (message: MessageEvent) => this.onDataChannelMessage(message);

  }

  private onDataChannelError(error: ErrorEvent) {
    trace("Data Channel Error:", error);
  }

  private onDataChannelMessage(event: MessageEvent) {
    trace("Got Data Channel Message:", event.data);
  }

  private onDataChannelOpen() {
    this.dataChannel.send("Hello World!");
  }

  private onDataChannelClose() {
    trace("The Data Channel is Closed");
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
