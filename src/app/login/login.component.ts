import Vue from 'vue';
import { Component } from "vue-property-decorator";
import { SetAlias } from '../core/store/modules/user.mutation-types';

@Component
export default class LoginComponent extends Vue {

  public get alias(): string {
    return this.$store.getters['user/getAlias'];
  }

  public set alias(value: string) {

    this.$store.commit(new SetAlias(value));
  }

  public get aaaa(): string {
    return this.$store.getters['user/getAlias'];
  }
}
