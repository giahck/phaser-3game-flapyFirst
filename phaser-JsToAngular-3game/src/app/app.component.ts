import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./components/home/home.component";
import { NavBarComponent } from "./components/nav-bar/nav-bar.component";
import { AuthData } from './models/registrazione/auth-data';
import { AuthService } from './auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, NavBarComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  user!: AuthData | null;

  constructor(private authSrv: AuthService) { }

  ngOnInit() {
    /* this.authSrv.restoreAuth(); */
    this.authSrv.user$.subscribe((user) => {
      this.user = user;
    });
    /* console.log("entrato ora"); */
  }
}
