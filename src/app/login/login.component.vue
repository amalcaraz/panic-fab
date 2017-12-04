<template>
  <div class="login">
    <label for="login__alias">Alias:</label>
    <input id="login__alias" type="text" v-model="alias"/>

    <h2>alias1 ==> {{alias}}</h2>
  </div>
</template>

<script lang="ts" src="./login.component.ts"></script>
