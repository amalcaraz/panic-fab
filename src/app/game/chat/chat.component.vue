<template>
  <div class="chat">
    <v-list>
      <v-list-tile avatar
                    v-for="(message, index) in chat.messages"
                    :key="index">
        <v-list-tile-avatar>
          <span :class="'icon white--text ' + getColorFromString(message.from)">{{getLetterFromString(message.from)}}</span>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>{{message.text}}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <v-text-field @keyup.enter="sendMessage(chat.currentMessage)"
                  v-model="chat.currentMessage"></v-text-field>
  </div>
</template>

<script src="./chat.component.ts" lang="ts"></script>
