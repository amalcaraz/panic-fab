import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import { Timer } from '@/app/timer/timer.model';

@Component
export default class TimerComponent extends Vue {

  private timer: Timer = new Timer();

  public get remainingTime(): string {
    return this.timer.toString();
  }

  public created() {
    this.timer.start(5);
  }

  public onClick() {

    this.timer.isStopped
      ? this.timer.resume()
      : this.timer.stop();

  }

}
