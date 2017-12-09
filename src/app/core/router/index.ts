import Vue from 'vue';
import VueRouter from 'vue-router';
import { Route } from 'vue-router/types/router';
import store from '../store/index';

import GameComponent from '@/app/game/game.component.vue';
import LoginComponent from '@/app/login/login.component.vue';
import Error404Component from '@/app/error-404/error-404.component.vue';
import { GET_ALIAS } from '../store/modules/user/user.getters';

Vue.use(VueRouter);

const router: VueRouter = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'game',
      component: GameComponent
    },
    {
      path: '/login',
      name: 'login',
      component: LoginComponent
    },
    {
      path: '*',
      name: '404',
      component: Error404Component
    }
  ]
});

router.beforeEach((to: Route, from: Route, next) => {

  const currentAlias: string = store.getters[GET_ALIAS];

  if (currentAlias) {

    to.name !== 'login'
      ? next()
      : next(false);

  } else {

    to.name !== 'login'
      ? next('login')
      : next();

  }

});

export default router;
