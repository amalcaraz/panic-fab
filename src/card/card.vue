<template>
  <div v-if="card" class="card"
       :class="_class"
       @click="onClick()">
  </div>
</template>

<script src="./card.ts" lang="ts"></script>
<style src="./card.scss" lang="scss" scoped></style>
