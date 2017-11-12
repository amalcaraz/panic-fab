<template>
  <div v-if="timer"
       class="timer"
  @click="onClick()">
    {{remainingTime}}
  </div>
</template>

<script src="./timer.component.ts" lang="ts"></script>
<style src="./timer.component.scss" lang="scss" scoped></style>
