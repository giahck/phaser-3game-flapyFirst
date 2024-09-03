import { Routes } from '@angular/router';
import { PhaserGameComponent } from './components/phaser-game/phaser-game.component';
import { CvComponent } from './components/cv/cv.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
   // { path: '', redirectTo: '/home', pathMatch: 'full' }, // Rotta di default che reindirizza a Home
     { path: 'home', loadChildren: () => import('./components/home/y.module').then(m => m.YModule) },
     { path: 'phaser-game', component: PhaserGameComponent },
     { path: 'cv', component: CvComponent },
];
