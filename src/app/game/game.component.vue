<template>
  <div>

    <game-menu v-if="game.state === GameState.Finished"
               @newGame="onNewGame"></game-menu>

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
              @click="onClick(card)"></card>
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
  import io from 'socket.io-client'

  @Component
  export default class GameComponent extends Vue {

    @Inject() private CardService: CardService;
    @Inject() private DiceService: DiceService;

    public GameState = GameState;
    public gameService: GameService = new GameService(this.CardService, this.DiceService);
    public game: Game = this.gameService.getGame();

    // public showDices: boolean = false;


    onNewGame() {

      this.game.start();

      const socket: SocketIOClient.Socket = io('http://localhost:3000');

      socket.on('this', (data: any) => {
        console.log(data);
        socket.emit('my other event', {my: 'data'});
      });

    }

    onTimeIsUp() {

      this.game.finish(false);

    }

    onClick(card: Card) {

      this.game.finish(this.game.checkWinerCard(card));

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
  @import '../../styles/index';

  button {
    margin: .5em .5em;
  }

  .game {
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
