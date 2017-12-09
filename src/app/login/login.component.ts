import Vue from 'vue';
import { Component } from "vue-property-decorator";

import LoginFormComponent from './login-form/login-form.component.vue';

@Component({
  components: {
    loginForm: LoginFormComponent
  }
})
export default class LoginComponent extends Vue {

}
