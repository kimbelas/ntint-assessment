import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ClockService } from '../../../services/clock.service';

@Component({
  selector: 'digital-clock',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './digital-clock.component.html',
  styleUrl: './digital-clock.component.scss',
})
export class DigitalClockComponent implements OnInit {
  currentTime!: Date;

  constructor(private clockService: ClockService) {}

  ngOnInit() {
    this.clockService.time$.subscribe((time: Date) => {
      this.currentTime = time;
    });
  }
}
