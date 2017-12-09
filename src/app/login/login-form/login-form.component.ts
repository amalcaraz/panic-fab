import Vue from 'vue';
import _ from 'lodash';
import { Component } from "vue-property-decorator";

import { SetAlias } from '../../core/store/modules/user/user.mutation-types';
import { GET_ALIAS } from '@/app/core/store/modules/user/user.getters';

@Component
export default class LoginFormComponent extends Vue {

  public valid: boolean = false;
  public alias: string = this.$store.getters[GET_ALIAS];

  private debouncedSetAlias = _.debounce((value: string) => {
    this.$store.commit(new SetAlias(value));
  }, 1000);

  public submit(value: string) {
    this.$store.commit(new SetAlias(value));
    this.$router.push('/');
  }

}
