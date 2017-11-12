import * as moment from 'moment';
import { Moment } from 'moment';

export class Timer {

  private static checkOffset: number = 250;

  public isStopped: boolean = true;
  public timeIsUp: boolean = false;
  private currentMoment: Moment = moment();

  private timerId: number;
  private countdownSeconds: number;
  private lastMoment: Moment;
  private goalMoment: Moment;

  public start(timeInSeconds: number) {
    this.countdownSeconds = timeInSeconds;
    this.reset();
  }

  public reset() {
    this.timeIsUp = false;
    this.goalMoment = moment().add(this.countdownSeconds, 'seconds');
    this.currentMoment = moment();
    this.lastMoment = moment();
    this.resume();
  }

  public resume() {
    this.isStopped = false;
    this.lastMoment = moment();
    this.timerId = setInterval(() => this.tick(), Timer.checkOffset);
  }

  public stop() {
    clearInterval(this.timerId);
    delete this.timerId;
    this.isStopped = true;
  }

  public toString(): string {

    if (this.timeIsUp) {

      return 'time is up!';

    } else if (!this.isStopped && this.goalMoment && this.currentMoment) {

      const diff = this.goalMoment.diff(this.currentMoment);

      return moment.utc(diff).format("mm:ss");

    } else {

      return 'Stopped!';

    }

  }

  private tick() {

    const now: Moment = moment();
    this.currentMoment = this.currentMoment.clone().add(now.diff(this.lastMoment));
    this.lastMoment = now;

    if (this.goalMoment.diff(this.currentMoment, 'seconds') <= 0) {

      this.stop();
      this.timeIsUp = true;
    }

  }
}
