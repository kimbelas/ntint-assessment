import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-design-procedures',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './design-procedures.component.html',
  styleUrl: './design-procedures.component.scss',
})
export class DesignProceduresComponent {
  private title = 'Design Procedures';

  constructor(private titleService: Title) {
    this.titleService.setTitle(this.title);
  }
}
