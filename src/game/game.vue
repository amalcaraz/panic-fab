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
      <card v-for="item in 10" :key="item"></card>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component } from 'vue-property-decorator'
  import CardComponent from '../card/card.vue'
  import DiceComponent from '../dice/dice.vue'
  import { Game } from './game'

  @Component({
    components: {card: CardComponent, dice: DiceComponent}
  })
  export default class GameComponent extends Vue {
    title: string = 'Panic Fab! ';
    game: Game = new Game();

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
