<template>
  <div class="menu">
    <h1>PanicFab!</h1>
    <ul class="menu__list">
      <li v-for="item in items">
        <button @click="onClick(item)">{{item.label}}</button>
      </li>
    </ul>
  </div>
</template>

<script src="./menu.component.ts" lang="ts"></script>
<style src="./menu.component.scss" lang="scss" scoped></style>
