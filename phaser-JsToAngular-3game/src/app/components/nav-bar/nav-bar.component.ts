import { Component, OnInit } from '@angular/core';
import feather from 'feather-icons';
import { AuthService } from '../../auth/auth.service';
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {
  constructor(private authSrv: AuthService) { }
  ngOnInit(): void {
    
  }
  logout(){
    this.authSrv.logout();
  }
  
}
