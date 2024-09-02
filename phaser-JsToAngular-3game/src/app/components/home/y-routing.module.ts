import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhaserGameComponent } from '../phaser-game/phaser-game.component';
import { HomeComponent } from './home.component';

const routes: Routes = [
  { path: 'phaser-game', component: PhaserGameComponent }, 
  { path: '', component: HomeComponent } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class YRoutingModule { }
