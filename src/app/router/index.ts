import Vue from 'vue';
import Router from 'vue-router';
import GameComponent from '@/app/game/game.component.vue';
import LoginComponent from '@/app/login/login.component.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Game page',
      component: GameComponent
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginComponent
    }
  ]
});
