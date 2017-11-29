<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
  import { default as Vue } from 'vue'
  import { CardService } from './card/card.service'
  import { DiceService } from './dice/dice.service'
  import CardComponent from './card/card.component.vue'
  import DiceComponent from './dice/dice.component.vue'
  import TimerComponent from './timer/timer.component.vue'
  import MenuComponent from './menu/menu.component.vue'
  import PeerList from './peer-list/peer-list.component.vue'
  import config from 'config'

  Vue.component('card', CardComponent);
  Vue.component('dice', DiceComponent);
  Vue.component('timer', TimerComponent);
  Vue.component('game-menu', MenuComponent);
  Vue.component('peer-list', PeerList);

  console.log(config);

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
