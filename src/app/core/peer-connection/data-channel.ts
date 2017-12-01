import { trace } from '@/app/utils';
import { EventEmitter } from 'events';

export interface IDataChannelClass extends IConstructor<DataChannel> {
  createDataChannel: (rtcDataChannel?: RTCDataChannel, id?: string, pc?: RTCPeerConnection) => DataChannel;
}

export type DataChannelEventType = 'open' | 'message';
export type DataChannelEventPayload = string | void;

export class DataChannel extends EventEmitter<DataChannelEventType, DataChannelEventPayload> {

  public static createDataChannel(rtcDataChannel?: RTCDataChannel, id?: string, pc?: RTCPeerConnection): DataChannel {

    trace('Created send data channel');

    if (rtcDataChannel) {

      return new DataChannel(rtcDataChannel);

    } else if (id && pc) {

      const config: RTCDataChannelInit = {};
      return new DataChannel(pc.createDataChannel(id, config));

    }

    throw new Error('wrong params for DataChannel::createDataChannel');

  }

  constructor(public rtcDataChannel: RTCDataChannel) {

    super();

    this.rtcDataChannel.onopen = () => this.onDataChannelOpenStatusChange();
    this.rtcDataChannel.onclose = () => this.onDataChannelOpenStatusChange();
    this.rtcDataChannel.onerror = (error: ErrorEvent) => this.onDataChannelError(error);
    this.rtcDataChannel.onmessage = (message: MessageEvent) => this.onDataChannelMessage(message);

  }

  public destroy() {
    this.rtcDataChannel.close();
  }

  public send(message: string) {

    this.rtcDataChannel.send(message);

  }

  private onDataChannelError(error: ErrorEvent) {
    trace("Data Channel Error:", error);
  }

  private onDataChannelMessage(event: MessageEvent) {

    trace("Got Data Channel Message:", event.data);
    this.emit('message');

  }

  private onDataChannelOpenStatusChange() {

    if (this.rtcDataChannel) {

      const state: RTCDataChannelState = this.rtcDataChannel.readyState;

      if (state === "open") {

        this.onDataChannelOpen();

      } else {

        this.onDataChannelClose();

      }
    }

  }

  private onDataChannelOpen() {

    trace(`The Data Channel ${this.rtcDataChannel.id} is Open`);
    this.send('Hello mate!');
    this.emit('open');

  }

  private onDataChannelClose() {
    trace(`The Data Channel ${this.rtcDataChannel.id} is Closed`);
  }

}
