import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';

import { Timer } from '@/app/timer/timer.model';

@Component
export default class TimerComponent extends Vue {

  @Prop({default: () => new Timer()})
  private timer: Timer;

  public get remainingTime(): string {
    return this.timer.toString();
  }

  @Watch('timer.timeIsUp')
  public onTimeIsUp(val: boolean, oldVal: boolean) {
    if (val === true) {
      this.$emit('timeIsUp', val);
    }
  }

  public onClick() {

    this.timer.isStopped
      ? this.timer.resume()
      : this.timer.stop();

  }

}
