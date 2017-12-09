<template>
  <v-app id="app" light>
    <v-navigation-drawer app fixed v-model="menuOpen"></v-navigation-drawer>
    <v-toolbar app dark color="primary">
      <v-toolbar-side-icon @click.stop="menuOpen = !menuOpen"></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">Panic Fab</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>more_vert</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <router-view>
        <v-container fluid></v-container>
      </router-view>
    </v-content>
    <v-footer app></v-footer>
  </v-app>
</template>

<script src="./app.component.ts" lang="ts"></script>
<style src="./app.component.scss" lang="scss"></style>
