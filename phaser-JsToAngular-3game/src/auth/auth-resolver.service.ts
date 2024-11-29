import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { AuthService } from '../app/auth/auth.service';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthResolverService implements Resolve<boolean> {
  constructor(private authService: AuthService, private router: Router) {}

  resolve(): Observable<boolean> {
    return from(this.authService.restoreAuth()).pipe(
      map(() => true) // Mappa il risultato in un valore booleano
    );
  }
}