import { Component, OnInit } from '@angular/core';
import feather from 'feather-icons';
import { AuthService } from '../../auth/auth.service';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {
  constructor(private authSrv: AuthService) { }
  ngOnInit(): void {
    
  }
  closeMenu() {
    const toggle = document.getElementById('menu-toggle') as HTMLInputElement;
    if (toggle) {
      toggle.checked = false;
    }
  }
  logout(){
    this.authSrv.logout();
  }
  
}
