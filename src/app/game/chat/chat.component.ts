import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { Chat } from '@/app/game/chat/chat.model';
import { getColorFromString, getLetterFromString } from '@/app/utils';

@Component
export default class ChatComponent extends Vue {

  @Prop() public chat: Chat;

  public sendMessage(message: string) {

    this.$emit('message', message);
    this.chat.sendMessage();

  }

  public getColorFromString(str: string): string {

    return getColorFromString(str);

  }

  public getLetterFromString(str: string): string {

    return getLetterFromString(str);

  }

}
