<template>
  <div class="peer-list">
    <ul>
      <li class="peer-list__item"
          v-for="peer in peers"
          :key="peer.alias"
          @click="onSelectedPeer(peer)">
        {{peer.alias}}
      </li>
    </ul>
  </div>
</template>

<script src="./peer-list.component.ts" lang="ts"></script>
<style src="./peer-list.component.scss" lang="scss" scoped></style>
