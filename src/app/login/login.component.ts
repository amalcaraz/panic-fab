import Vue from 'vue';
import { Component } from "vue-property-decorator";
import { SetAlias } from '../core/store/modules/user.mutation-types';
import _ from 'lodash';

@Component
export default class LoginComponent extends Vue {

  private debouncedSetAlias = _.debounce((value: string) => {
    this.$store.commit(new SetAlias(value));
  }, 1000);

  public get alias(): string {
    return this.$store.getters['user/getAlias'];
  }

  public set alias(value: string) {
    this.debouncedSetAlias(value);
  }

}
