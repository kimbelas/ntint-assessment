import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClockService implements OnDestroy {
  private timeSubject = new BehaviorSubject<Date>(this.getSystemTime());
  public time$ = this.timeSubject.asObservable();

  private isTimeAdjusted = false;
  private timeIntervalId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.startClock();
  }

  private getSystemTime(): Date {
    return new Date();
  }

  private startClock(): void {
    this.timeIntervalId = setInterval(() => {
      this.isTimeAdjusted
        ? this.incrementAdjustedTime()
        : this.syncWithSystemTime();
    }, 1000);
  }

  private syncWithSystemTime(): void {
    const systemTime = this.getSystemTime();
    this.updateTime(systemTime);
  }

  private incrementAdjustedTime(): void {
    const currentTime = this.timeSubject.value;
    const nextTime = new Date(currentTime.getTime() + 1000);
    this.updateTime(nextTime);
  }

  private updateTime(newTime: Date): void {
    this.timeSubject.next(newTime);
    localStorage.setItem('displayTime', newTime.toISOString());
  }

  public adjustTime(minutes: number): void {
    const adjustedTime = new Date(
      this.timeSubject.value.getTime() + minutes * 60000
    );
    this.isTimeAdjusted = true;
    this.updateTime(adjustedTime);
  }

  public resetTime(): void {
    this.isTimeAdjusted = false;
    this.syncWithSystemTime();
  }

  ngOnDestroy(): void {
    if (this.timeIntervalId) {
      clearInterval(this.timeIntervalId);
    }
  }
}
