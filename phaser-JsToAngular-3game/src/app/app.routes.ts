import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
   // { path: '', redirectTo: '/home', pathMatch: 'full' }, // Rotta di default che reindirizza a Home
     { path: 'home', loadChildren: () => import('./components/home/y.module').then(m => m.YModule) },
   
];
