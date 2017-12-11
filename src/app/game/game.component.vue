<template>
  <div class="game">

    <v-navigation-drawer app fixed clipped>
      
      <!--<game-menu v-if="game.state === GameState.Finished"
                @newGame="onNewGame"></game-menu>-->

      <pf-peer-list :me="webRTC.peerList.me"
                 :peers="webRTC.peerList.peers"
                 @selectedPeer="onSelectedPeer"></pf-peer-list>

    </v-navigation-drawer>

    <v-container fluid grid-list-md>
      <v-layout row wrap align-center justify-center>

        <v-flex xs6 class="mt-5">
          <pf-chat v-if="chat"
                   :chat="chat"></pf-chat>
        </v-flex>
      
        <div v-if="game.state === GameState.InProgress">

          <pf-timer ref="timer"
                :timer="game.timer"
                @timeIsUp="onTimeIsUp"></pf-timer>

          <div class="game__dices">
            <pf-dice v-for="(dice, index) in game.dices"
                  :key="index"
                  :dice="dice"></pf-dice>
          </div>
          <!--<button @click="rollDices">Roll dices!</button>-->

          <!--<button @click="findCard">Find the amoeba!</button>-->
          <div class="game__cards">
            <pf-card v-for="(card, index) in game.cards"
                  :key="index"
                  :card="card"
                  :class="{active: card.isActive}"
                  @click="onCardClick(card)"></pf-card>
          </div>

        </div>

      </v-layout>
    </v-container>
  </div>
</template>

<script src="./game.component.ts" lang="ts"></script>
<style src="./game.component.scss" lang="scss" scoped></style>
