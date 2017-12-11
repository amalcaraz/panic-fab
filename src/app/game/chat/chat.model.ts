import { DataChannel } from '@/app/core/peer-connection/data-channel';

export interface IChatMessage {
  from: string;
  text: string;
}

export class Chat {

  public messages: IChatMessage[] = [];
  public currentMessage: string = '';

  constructor(public from: string,
              private dataChannel: DataChannel) {

    dataChannel.on('message', (incomingMessage: string) => {

      const message: IChatMessage = JSON.parse(incomingMessage);
      this.messages.push(message);

    });

  }

  public sendMessage() {

    const message: IChatMessage = {
      from: this.from,
      text: this.currentMessage
    };

    this.messages.push(message);

    const outgoingMessage: string = JSON.stringify(message);
    this.dataChannel.send(outgoingMessage);

    this.currentMessage = '';

  }

  public clear() {

    this.messages = [];
    this.currentMessage = '';

  }

  public destroy() {

    this.clear();
    this.dataChannel.destroy();

  }

}
