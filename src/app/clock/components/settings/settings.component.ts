import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ClockService } from '../../../services/clock.service';

@Component({
  selector: 'settings',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  constructor(private clockService: ClockService) {}

  incrementTime() {
    this.clockService.adjustTime(1);
  }

  decrementTime() {
    this.clockService.adjustTime(-1);
  }
}
