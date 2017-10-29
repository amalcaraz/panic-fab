<template>
  <div class="dice">
    {{dice.currentFace}}
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component, Prop } from 'vue-property-decorator'
  import { Dice } from './dice'
  import { AmoebaColorType } from '../card/card'

  @Component({})
  export default class DiceComponent extends Vue {
    @Prop({
      type: Object,
      default: () => ({currentFace: 0})
    })
    dice: Dice;

    data() {
      return {
        aaa: AmoebaColorType
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  $bg-color: #ffffff;
  $border-color: #333;
  .dice {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $bg-color;
    border: 1px solid $border-color;
    color: black;
    height: 50px;
    width: 50px;
    margin: 0 10px;
  }
</style>
