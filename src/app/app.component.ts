import Vue from "vue";
import Vuetify from "vuetify";

import { CardService } from "./game/card/card.service";
import { DiceService } from "./game/dice/dice.service";
import CardComponent from "./game/card/card.component.vue";
import DiceComponent from "./game/dice/dice.component.vue";
import TimerComponent from "./game/timer/timer.component.vue";
import MenuComponent from "./game/menu/menu.component.vue";
import PeerList from "./game/peer-list/peer-list.component.vue";
import ChatComponent from "./game/chat/chat.component.vue";
import { Component } from 'vue-property-decorator';

Vue.use(Vuetify);

Vue.component("pf-card", CardComponent);
Vue.component("pf-dice", DiceComponent);
Vue.component("pf-timer", TimerComponent);
Vue.component("pf-game-menu", MenuComponent);
Vue.component("pf-peer-list", PeerList);
Vue.component("pf-chat", ChatComponent);

@Component({
  provide: {
    CardService: new CardService(),
    DiceService: new DiceService()
  }
})
export default class AppComponent extends Vue {
  public menuOpen: boolean = false;
}
