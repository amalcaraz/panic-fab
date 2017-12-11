import io from 'socket.io-client';

import config from 'config';
import { ISignalingSocketConf } from '@/app/core/peer-connection/signaling-channel';

export interface ISignalingSocketConf {
  host: string;
  port: number;
  namespace: string;
}

export type SignAlignEventTypes =
  'connect' | 'login' | 'logout' | 'new-peer' | 'peer-disconnected' | 'peer-list' | 'ice-candidate' | 'sdp';

export class SignalingChannel {

  private socket: SocketIOClient.Socket;
  private socketConf: ISignalingSocketConf;

  constructor() {

    if (!this.socket) {

      this.socketConf = config.signalignSocket;
      const socketUrl: string = `${this.socketConf.host}:${this.socketConf.port}${this.socketConf.namespace}`;
      this.socket = io.connect(socketUrl);

    }

  }

  public close() {

    delete this.socketConf;
    this.socket.close();

  }

  public on(event: SignAlignEventTypes, fn: (event: any) => void): this {

    this.socket.on(event, fn);
    return this;

  }

  public off(event: SignAlignEventTypes, fn?: (event: any) => void): this {

    this.socket.off(event, fn);
    return this;

  }

  public emit(event: SignAlignEventTypes, ...args: any[]): this {

    this.socket.emit(event, ...args);
    return this;

  }

}
