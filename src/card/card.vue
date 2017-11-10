<template>
  <div v-if="card" class="card"
       :class="_class"
       @click="onClick()">
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component, Prop } from 'vue-property-decorator'
  import { Card, AirVentCard, AmoebaCard, MutationRoomCard, FabCard } from './card.model'

  @Component
  export default class CardComponent extends Vue {

    @Prop()
    card: Card;

    get _class(): ({ [_class: string]: boolean } | string)[] {

      const classes: ({ [_class: string]: boolean } | string)[] = [{
        'card--air-vent': this.card instanceof AirVentCard,
        'card--amoeba': this.card instanceof AmoebaCard,
        'card--mutation-room': this.card instanceof MutationRoomCard,
        'card--fab': this.card instanceof FabCard
      }]

      if (this.card instanceof AmoebaCard) {

        classes.push(`card--amoeba--color-${this.card['color']}`)
        classes.push(`card--amoeba--shape-${this.card['shape']}`)
        classes.push(`card--amoeba--pattern-${this.card['pattern']}`)

      } else if (this.card instanceof MutationRoomCard) {

        classes.push(`card--mutation-room--type-${this.card['type']}`)

      } else if (this.card instanceof FabCard) {

        classes.push(`card--fab--type-${this.card['type']}`)

      }

      return classes

    }

    // Component methods can be declared as instance methods
    onClick(): void {

      window.alert('hola')

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  @mixin sprite-increment($initial-pos: 0, $increment: 0, $iterations: 2, $axis: 'y') {
    @for $i from 0 to $iterations {
      &-#{$i} {
        background-position-#{$axis}: $initial-pos + $increment*$i;
        @content
      }
    }
  }

  $bg-color: #ccc;
  $border-color: #333;
  $incrementX: 104px;
  $incrementY: 104px;
  $initialOffsetX: 20px;
  $initialOffsetY: 177px;

  .card {
    display: block;
    flex: 0 1 auto;
    background: $bg-color url('../assets/panic-sprites.jpeg') no-repeat;
    border: 1px solid $border-color;
    color: white;
    height: 96px;
    width: 96px;
    margin: 0 10px;

    &--air-vent {
      background-position: -229px -486px;
    }

    &--fab {
      $fabX: -$initialOffsetX + -$incrementX*2;
      $fabY: -$initialOffsetY;
      $fabYIncrement: -$incrementY;

      background-position-x: $fabX;

      &--type {
        @include sprite-increment($fabY, $fabYIncrement, 3);
      }

    }

    &--mutation-room {
      $mutationRoomX: -$initialOffsetX + -$incrementX*3;
      $mutationRoomY: -$initialOffsetY;
      $mutationRoomYIncrement: -$incrementY;

      background-position-x: $mutationRoomX;

      &--type {
        @include sprite-increment($mutationRoomY, $mutationRoomYIncrement, 3);
      }
    }

    &--amoeba {
      $amoebaX: -$initialOffsetX;
      $amoebaY: -$initialOffsetY;

      background-position-x: $amoebaX;
      background-position-y: $amoebaY;

      &--color {
        $amoebaColorXIncrement: -$incrementX;
        @include sprite-increment($amoebaX, $amoebaColorXIncrement, 2, 'x');
      }

      $amoebaShapeYIncrement: -$incrementY*2;
      @for $i from 0 to 2 {

        &--shape-#{$i}.card--amoeba--pattern{
          $amoebaPatternY: $amoebaY + $amoebaShapeYIncrement*$i;
          $amoebaPatternYIncrement: -$incrementY;
          @include sprite-increment($amoebaPatternY, $amoebaPatternYIncrement, 2, 'y');
        }

      }
    }

  }

</style>
