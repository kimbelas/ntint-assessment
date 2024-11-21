import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AnalogClockComponent } from './components/analog-clock/analog-clock.component';
import { DigitalClockComponent } from './components/digital-clock/digital-clock.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SharedModule } from '../shared/shared.module';
import { ClockService } from '../services/clock.service';
import { Router } from '@angular/router';

@Component({
  selector: 'sync-clock',
  standalone: true,
  imports: [
    AnalogClockComponent,
    DigitalClockComponent,
    SettingsComponent,
    SharedModule,
  ],
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss'],
})
export class ClockComponent implements OnInit, OnDestroy {
  private title = 'Take home assignment - I';
  private displayTime: Date = new Date();
  private timeSubscription: any;

  constructor(
    private titleService: Title,
    private clockService: ClockService,
    private router: Router
  ) {
    this.titleService.setTitle(this.title);
  }

  ngOnInit(): void {
    this.loadSavedTime();
    this.subscribeToTimeUpdates();
    this.handleBeforeUnload();
  }

  private loadSavedTime(): void {
    const savedTime = localStorage.getItem('displayTime');
    this.displayTime = savedTime ? new Date(savedTime) : new Date();
  }

  private subscribeToTimeUpdates(): void {
    this.timeSubscription = this.clockService.time$.subscribe((time) => {
      this.displayTime = time;
    });
  }

  private handleBeforeUnload(): void {
    window.addEventListener(
      'beforeunload',
      this.beforeUnloadHandler.bind(this)
    );
  }

  private beforeUnloadHandler(event: BeforeUnloadEvent): void {
    if (this.router.url === '/clock') {
      const systemTime = new Date();
      const timeDifference = Math.abs(
        systemTime.getTime() - this.displayTime.getTime()
      );

      if (timeDifference > 2000) {
        event.preventDefault();
      } else {
        localStorage.removeItem('displayTime');
      }
    }
  }

  ngOnDestroy(): void {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }
}
