<template>
  <div v-if="card !== undefined" class="card" @click="onClick()">
    {{card.constructor.name}}
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component, Prop } from 'vue-property-decorator'
  import { Card } from './card.model'

  @Component({})
  export default class CardComponent extends Vue {
    @Prop()
    card: Card;

    // Component methods can be declared as instance methods
    onClick(): void {
      window.alert('hola')
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  $bg-color: #ccc;
  $border-color: #333;
  .card {
    display: block;
    flex: 0 1 auto;
    background-color: $bg-color;
    border: 1px solid $border-color;
    color: white;
    height: 100px;
    width: 100px;
    margin: 0 10px;
  }
</style>
