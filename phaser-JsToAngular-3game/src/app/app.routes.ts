import { RouterModule, Routes } from '@angular/router';
import { PhaserGameComponent } from './components/phaser-game/phaser-game.component';
import { CvComponent } from './components/cv/cv.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { AuthResolverService } from '../auth/auth-resolver.service';

export const routes: Routes = [
   /* { path: '', component: HomeComponent }, */ // Rotta di default che reindirizza a Login
   /* { path: 'login', loadChildren: () => import('./auth/auth-rout.module').then(m => m.AuthRoutModule) }, */
   { path: '', loadChildren: () => import('./components/home/y.module').then(m => m.YModule), /* resolve: { auth: AuthResolverService } */  },
  /*  { path: 'phaser-game', component: PhaserGameComponent,},
   { path: 'cv', component: CvComponent }, */
];
@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
 })
 export class AppRoutingModule { }
