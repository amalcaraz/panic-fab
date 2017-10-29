<template>
  <div class="card" @click="onClick()">
    {{message}}
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'

  export default class CardComponent extends Vue {
    // Initial data can be declared as instance properties
    message: string = 'Hello!'

    // Component methods can be declared as instance methods
    onClick(): void {
      window.alert(this.message)
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
