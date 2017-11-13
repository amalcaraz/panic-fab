<template>
  <div v-if="card" class="card"
       :class="_class"
       @click="onClick(card)">
  </div>
</template>

<script src="./card.component.ts" lang="ts"></script>
<style src="./card.component.scss" lang="scss" scoped></style>
