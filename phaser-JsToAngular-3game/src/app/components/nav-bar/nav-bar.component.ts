
import { Component, OnInit } from '@angular/core';
import feather from 'feather-icons';
import { AuthService } from '../../auth/auth.service';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { WebsocketService } from '../../service/websocket.service';
import { Subscription } from 'rxjs';
import { cleanupGame } from '../phaser-game/js/game';
import { cleanupGameDino } from '../phaser-game/jsDino/gameDino';
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {
  private routerSubscription!: Subscription;
  constructor(private authSrv: AuthService,private webSocketService: WebsocketService, private router: Router) { }
  ngOnInit(): void {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        cleanupGame();
        cleanupGameDino();
      }
    });
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
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
  
}
