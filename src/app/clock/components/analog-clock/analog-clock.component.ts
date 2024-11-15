import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ClockService } from '../../../services/clock.service';

@Component({
  selector: 'analog-clock',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './analog-clock.component.html',
  styleUrl: './analog-clock.component.scss',
})
export class AnalogClockComponent implements OnInit, OnDestroy {
  inc = 1000;
  timeInterval: any;
  hourRotation: number = 0;
  minuteRotation: number = 0;
  secondRotation: number = 0;
  countStarted: boolean = false;
  numbers = Array.from({ length: 12 }, (_, i) => i + 1);

  constructor(private clockService: ClockService) {}

  ngOnInit(): void {
    this.updateClock();
    this.startClock();
  }

  startClock() {
    this.countStarted = true;
    this.timeInterval = setInterval(() => this.updateClock(), this.inc);
  }

  updateClock() {
    this.clockService.time$.subscribe((date: Date) => {
      const hours = ((date.getHours() + 11) % 12) + 1;
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      this.hourRotation = hours * 30;
      this.minuteRotation = minutes * 6;
      this.secondRotation = seconds * 6;
    });
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }
}
