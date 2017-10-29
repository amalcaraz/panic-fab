<template>
  <div>
    <h2>{{title}}</h2>
    <div class="game__cards">
      <card v-for="item in 10" :key="index"></card>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import CardComponent from '../card/card.vue'

  @Component({
    components: {card: CardComponent}
  })
  export default class GameComponent extends Vue {
    title: string = 'Game Page!';
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .game {
    &__cards {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
  }
</style>
