import { trace } from '@/app/utils';

export class DataChannel {

  public rtcDataChannel: RTCDataChannel;

  constructor(private pc: RTCPeerConnection,
              public id: string) {

    const config: RTCDataChannelInit = {};
    this.rtcDataChannel = this.pc.createDataChannel(this.id, config);
    trace('Created send data channel');

    this.rtcDataChannel.onopen = () => this.onDataChannelOpen();
    this.rtcDataChannel.onclose = () => this.onDataChannelClose();
    this.rtcDataChannel.onerror = (error: ErrorEvent) => this.onDataChannelError(error);
    this.rtcDataChannel.onmessage = (message: MessageEvent) => this.onDataChannelMessage(message);

  }

  public destroy() {
    this.rtcDataChannel.close();
  }

  private onDataChannelError(error: ErrorEvent) {
    trace("Data Channel Error:", error);
  }

  private onDataChannelMessage(event: MessageEvent) {
    trace("Got Data Channel Message:", event.data);
  }

  private onDataChannelOpen() {
    this.rtcDataChannel.send("Hello World!");
  }

  private onDataChannelClose() {
    trace("The Data Channel is Closed");
  }

}
