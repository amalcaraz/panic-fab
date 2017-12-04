<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
  import { default as Vue } from 'vue'
  import { CardService } from './game/card/card.service'
  import { DiceService } from './game/dice/dice.service'
  import CardComponent from './game/card/card.component.vue'
  import DiceComponent from './game/dice/dice.component.vue'
  import TimerComponent from './game/timer/timer.component.vue'
  import MenuComponent from './game/menu/menu.component.vue'
  import PeerList from './game/peer-list/peer-list.component.vue'

  Vue.component('card', CardComponent);
  Vue.component('dice', DiceComponent);
  Vue.component('timer', TimerComponent);
  Vue.component('game-menu', MenuComponent);
  Vue.component('peer-list', PeerList);

  export default Vue.extend({
    name: 'app',
    provide: {
      CardService: new CardService(),
      DiceService: new DiceService()
    }
  })
</script>

<style lang="scss">
  @import "../styles/index";

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: $body-color;
  }
</style>
