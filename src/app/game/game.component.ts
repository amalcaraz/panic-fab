import Vue from 'vue';

import { Component, Inject } from 'vue-property-decorator';
import { Game, GameState } from './game.model';
import { CardService } from './card/card.service';
import { DiceService } from './dice/dice.service';
import { GameService } from './game.service';
import { Card } from './card/card.model';
import { Timer } from './timer/timer.model';
import { WebRtcService } from "./web-rtc/web-rtc.service";
import { IPeerData } from "./peer-list/peer-list.model";
import { DataChannel } from "../core/peer-connection/data-channel";
import { GET_ALIAS } from '../core/store/modules/user/user.getters';
import { Chat } from './chat/chat.model';

@Component
export default class GameComponent extends Vue {

  @Inject() public CardService: CardService;
  @Inject() public DiceService: DiceService;

  public alias: string = this.$store.getters[GET_ALIAS];
  public GameState = GameState;
  public gameService: GameService = new GameService(this.CardService, this.DiceService);
  public game: Game = this.gameService.getGame();
  public chat: Chat | null = null;
  public webRTC: WebRtcService = new WebRtcService(this.alias);

  // public showDices: boolean = false;

  public onNewGame() {

    this.game.start();

  }

  public created() {

    this.webRTC.on('data-channel', (dataChannel: DataChannel) => this.onDataChannel(dataChannel));

  }

  public onTimeIsUp() {

    this.game.finish(false);

  }

  public onSelectedPeer(peer: IPeerData) {

    this.webRTC
      .initDataTransmission(peer)
      .then((dataChannel: DataChannel) => this.onDataChannel(dataChannel));

  }

  public onDataChannel(dataChannel: DataChannel) {

    this.destroyDataChannel();
    this.chat = new Chat(this.alias, dataChannel);

  }

  public destroyDataChannel() {

    if (this.chat) {

      this.chat.destroy();

    }

  }

  public onCardClick(card: Card) {

    this.game.finish(this.game.checkWinerCard(card));

  }

  // LifeHook
  public beforeDestroy() {

    this.webRTC.destroy();

  }

  /*
  rollDices() {

    this.showDices = true;
    this.animateDices();

  }
  */

  public findCard() {

    const card: Card | null = this.game.findSearchedCard();

    if (!card) {

      alert('Amoeba disintegrated!');

    }

  }

  private animateDices(i: number = 0) {

    requestAnimationFrame(() => {

      this.game.rollDices();

      if (i < 50) {

        this.animateDices(++i);
      }

    });

  }

}
