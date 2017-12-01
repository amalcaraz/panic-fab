<template>
  <div class="game">

    <!--<game-menu v-if="game.state === GameState.Finished"
               @newGame="onNewGame"></game-menu>-->

    <peer-list :me="webRTC.peerList.me"
               :peers="webRTC.peerList.peers"
               @selectedPeer="onSelectedPeer"></peer-list>

    <div>
      <h5>Chat P2P:</h5>
      <p v-for="message in messages">
        {{message}}
      </p>
      <input type="text" v-model="myMessage" @keyup.enter="sendMessage()"/>
    </div>

    <div v-if="game.state === GameState.InProgress">

      <timer ref="timer"
             :timer="game.timer"
             @timeIsUp="onTimeIsUp"></timer>

      <div class="game__dices">
        <dice v-for="(dice, index) in game.dices"
              :key="index"
              :dice="dice"></dice>
      </div>
      <!--<button @click="rollDices">Roll dices!</button>-->

      <!--<button @click="findCard">Find the amoeba!</button>-->
      <div class="game__cards">
        <card v-for="(card, index) in game.cards"
              :key="index"
              :card="card"
              :class="{active: card.isActive}"
              @click="onCardClick(card)"></card>
      </div>

    </div>

  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component, Inject } from 'vue-property-decorator'
  import { Game, GameState } from './game.model'
  import { CardService } from '../card/card.service'
  import { DiceService } from '../dice/dice.service'
  import { GameService } from './game.service'
  import { Card } from '../card/card.model'
  import { Timer } from '../timer/timer.model'
  import { WebRtcService } from "../web-rtc/web-rtc.service";
  import { IPeerData } from "../peer-list/peer-list.model";
  import { DataChannel } from "../core/peer-connection/data-channel";

  @Component
  export default class GameComponent extends Vue {

    @Inject() private CardService: CardService;
    @Inject() private DiceService: DiceService;

    public GameState = GameState;
    public gameService: GameService = new GameService(this.CardService, this.DiceService);
    public game: Game = this.gameService.getGame();
    public webRTC: WebRtcService = new WebRtcService(`Alias-${Math.random() * 100}`);
    public messages: string[] = [];
    public myMessage: string = '';

    public currentDataChannel: DataChannel | undefined;

    // public showDices: boolean = false;


    get thereIsDataChannel(): boolean {
      return !!this.currentDataChannel;
    }

    onNewGame() {

      this.game.start();
      this.webRTC.on('data', this.onDataChannel.bind(this))

    }

    onTimeIsUp() {

      this.game.finish(false);

    }

    onSelectedPeer(peer: IPeerData) {

      if (this.currentDataChannel) {

        this.currentDataChannel.destroy();
        this.currentDataChannel = undefined;

      }

      this.webRTC
        .initDataTransmission(peer)
        .then(this.onDataChannel.bind(this));

    }

    onDataChannel(dataChannel: DataChannel) {

      this.currentDataChannel = dataChannel;

      dataChannel.on('message', (msg: string) => {

        this.messages.push(msg);

      });

    }

    sendMessage() {

      debugger;

      if (this.currentDataChannel) {

        this.currentDataChannel.send(this.myMessage);

      }

    }

    onCardClick(card: Card) {

      this.game.finish(this.game.checkWinerCard(card));

    }

    // LifeHook
    beforeDestroy() {

      this.webRTC.destroy();

    }

    /*
    rollDices() {

      this.showDices = true;
      this.animateDices();

    }
    */

    findCard() {

      const card: Card | null = this.game.findSearchedCard();

      if (!card) {

        alert('Amoeba disintegrated!');

      }

    }

    private animateDices(i: number = 0) {

      requestAnimationFrame(() => {

        this.game.rollDices();
        if (i < 50) this.animateDices(++i);

      });

    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '../../styles/config/index';

  $game-padding: 2rem !default;

  button {
    margin: .5em .5em;
  }

  .game {

    padding: $game-padding 0 $game-padding 200px;

    &__cards {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }

    &__dices {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      padding-bottom: 20px;
      margin-bottom: 20px;
      border-bottom: 1px solid $clr-grey-2;
    }
  }
</style>
