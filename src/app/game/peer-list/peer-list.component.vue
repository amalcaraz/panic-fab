<template>
  <div class="peer-list">
    <v-list subheader>
      <v-subheader>You</v-subheader>
        <v-list-tile avatar>
          <v-list-tile-avatar>
              <v-icon dark class="indigo white--text">face</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{me.alias}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
    </v-list>
    <template v-if="peers.length > 0">
      <v-divider></v-divider>
      <v-list subheader>
        <v-subheader>Other players</v-subheader>
        <v-list-tile avatar
                     v-for="peer in peers"
                     :key="peer.alias"
                     @click="onSelectedPeer(peer)">
          <v-list-tile-avatar>
            <span :class="'icon white--text headline ' + getColorFromString(peer.alias)">{{getLetterFromString(peer.alias)}}</span>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{peer.alias}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </template>
  </div>
</template>

<script src="./peer-list.component.ts" lang="ts"></script>
