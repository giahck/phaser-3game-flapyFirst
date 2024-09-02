import { Component, OnDestroy, OnInit } from '@angular/core';
import { PhaserGameComponent } from "../phaser-game/phaser-game.component";
import { AuthData } from '../../models/registrazione/auth-data';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { LoginComponent } from "../../auth/login/login.component";
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PhaserGameComponent, CommonModule, LoginComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit,OnDestroy {
  user!: AuthData | null;
  isAuthChecked = false;
  private destroy$ = new Subject<void>();

  constructor(private authSrv: AuthService,private route: ActivatedRoute) { }

  ngOnInit() {
    this.authSrv.restoreAuth();
    this.authSrv.authChecked$.pipe(takeUntil(this.destroy$)).subscribe((isChecked) => {
      this.isAuthChecked = isChecked;
      if (isChecked) {
        this.authSrv.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
          this.user = user;
        });
      }
    });
    this.route.queryParams
    .subscribe(params => {
      if (params["code"] !== undefined) {
        this.authSrv.getToken(params["code"]).subscribe(result => {
         console.log(result);
        });
      }
    }
  );

  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
