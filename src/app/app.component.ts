import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private title = 'Take home assignment - I';

  constructor(private titleService: Title) {
    this.titleService.setTitle(this.title);
  }
}
