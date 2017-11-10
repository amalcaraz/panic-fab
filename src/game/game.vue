<template>
  <div>
    <h2>{{title}}</h2>

    <h3>Dices:</h3>
    <div class="game__dices">
      <dice v-for="(dice, index) in game.dices" :key="index" :dice="dice"></dice>
    </div>
    <button @click="rollDices()">Roll dices!</button>

    <h3>Cards:</h3>
    <div class="game__cards">
      <card v-for="(card, index) in game.cards" :key="index" :card="card"></card>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component, Inject } from 'vue-property-decorator'
  import { Game } from './game.model'
  import { CardService } from '../card/card.service'
  import { DiceService } from '../dice/dice.service'
  import { GameService } from './game.service'

  @Component({})
  export default class GameComponent extends Vue {
    @Inject() CardService: CardService;
    @Inject() DiceService: DiceService;

    title: string = 'Panic Fab! ';
    gameService: GameService = new GameService(this.CardService, this.DiceService);
    game: Game = this.gameService.getGame();

    rollDices() {
      this.game.rollDices()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  button {
    margin: 1em 0;
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
    }
  }
</style>
