<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
  import { default as Vue } from 'vue'
  import { CardService } from './card/card.service'
  import { DiceService } from './dice/dice.service'
  import CardComponent from './card/card.vue'
  import DiceComponent from './dice/dice.vue'

  Vue.component('card', CardComponent)
  Vue.component('dice', DiceComponent)

  export default Vue.extend({
    name: 'app',
    provide: {
      CardService: new CardService(),
      DiceService: new DiceService()
    }
  })
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
