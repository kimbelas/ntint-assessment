import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-design-procedures',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './design-procedures.component.html',
  styleUrl: './design-procedures.component.scss',
})
export class DesignProceduresComponent {}
