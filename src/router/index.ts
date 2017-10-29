import Vue from 'vue';
import Router from 'vue-router';
import GameComponent from '@/game/game.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Game page',
      component: GameComponent
    }
  ]
});
