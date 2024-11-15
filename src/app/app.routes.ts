import { Routes } from '@angular/router';
import { ClockComponent } from './clock/clock.component';
import { TableComponent } from './table/table.component';
import { DesignProceduresComponent } from './design-procedures/design-procedures.component';

export const routes: Routes = [
  { path: 'clock', component: ClockComponent },
  { path: 'table', component: TableComponent },
  { path: 'design-procedures', component: DesignProceduresComponent },
  { path: '', redirectTo: 'clock', pathMatch: 'full' },
  { path: '**', redirectTo: 'clock' },
];
