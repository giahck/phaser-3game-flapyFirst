import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhaserGameComponent } from '../phaser-game/phaser-game.component';
import { HomeComponent } from './home.component';
import { AuthResolverService } from '../../../auth/auth-resolver.service';
import { CvComponent } from '../cv/cv.component';

const routes: Routes = [
  { path: '', component: HomeComponent } ,
  { path: 'phaser-game', component: PhaserGameComponent,resolve: { auth: AuthResolverService }}, 
  { path: 'cv', component: CvComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class YRoutingModule { }
