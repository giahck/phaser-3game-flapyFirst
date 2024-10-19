import { Injectable } from '@angular/core';
import { AuthData, Token } from '../models/registrazione/auth-data';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiURL = environment.apiURL;
   authChecked$ = new BehaviorSubject<boolean>(false);
  private authSub = new BehaviorSubject<AuthData | null>(null);
  user$ = this.authSub.asObservable();
  userId$: Observable<number | null> = this.authSub.pipe(
    map(user => user ? user.id : null)
  );
  private jwtHelper = new JwtHelperService();
  private timeOut: any;

  constructor(
    private http: HttpClient,
    /* private cookieService: CookieService, */
    private router: Router
  ) {}

  get getId(): number | null{
    const user=this.authSub.getValue();
   // console.log(user);
    return user ? user.id : null;
  }
  get(url: string): Observable<any> {
    return this.http.get(this.apiURL + url);
  }
 getToken(code: string): Observable<boolean> {
     console.log('Token Request:', code);
    return this.http.get<Token>(`${this.apiURL}auth/callback?code=${code}`, { observe: 'response' })
      .pipe(
        map((response: HttpResponse<Token>) => {
          console.log('Token Response:', response);
          if (response.status === 200 && response.body) {
            const { idToken, accessToken } = response.body;
  
            if (this.isJwt(idToken)) {
              localStorage.setItem('jwToken', accessToken);
              localStorage.setItem('accessTokenId', idToken);
              this.http.get<AuthData>(`${this.apiURL}messages`, {
                headers: new HttpHeaders({ 'Authorization': `Bearer ${accessToken}` }),
                observe: 'response'
              }).subscribe((messageResponse: HttpResponse<AuthData>) => {
                if (messageResponse.body) {
                  console.log('Message Response:', messageResponse.body);
                  messageResponse.body.idToken = idToken;
                  this.authSub.next(messageResponse.body);
                  this.authChecked$.next(true);
                  this.autoLogout(messageResponse.body);
                } else {
                  console.error('Message response body is null.');
                }
              }, error => {
                console.error('Error Status Code:', error.status);
              });
  
              return true;
            } else {
              console.error('ID Token non valido:', idToken);
              return false;
            }
          } else {
            return false;
          }
        }),
        catchError(error => {
          console.error('Token Request Error:', error);
          return throwError(false);
        })
      ); 
  }

  login(data: { email: string; password: string; rememberMe: boolean }): Observable<AuthData> {
    return this.http.post<AuthData>(`${this.apiURL}auth/login`, data).pipe(
      tap((dataResponse) => {
        if (dataResponse && dataResponse.jwToken) {
          console.log('Login:', dataResponse);
          this.setToken(dataResponse.jwToken, dataResponse.rememberMe);
          this.authSub.next(dataResponse);
          this.authChecked$.next(true);
          this.autoLogout(dataResponse);
        }
      }),
      catchError(this.handleError)
    );
  }

  register(data: FormData): Observable<AuthData> {
    return this.http.post<AuthData>(`${this.apiURL}auth/register`, data).pipe(
      catchError(this.handleError)
    );
  }

  autoLogout(user: AuthData | null) {
    if (user && this.isJwt(user.jwToken)) {
      console.log('Auto logout:', user);
      const expirationDate = this.jwtHelper.getTokenExpirationDate(user.jwToken) as Date;
      const millisecondsExp = expirationDate.getTime() - new Date().getTime();
      this.timeOut = setTimeout(() => this.logout(), millisecondsExp);
    } else if(user && user.idToken && this.isIdJwt(user.idToken)) {
      const expirationDate = this.jwtHelper.getTokenExpirationDate(user.idToken) as Date;
      const millisecondsExp = expirationDate.getTime() - new Date().getTime();
      this.timeOut = setTimeout(() => this.logout(), millisecondsExp);
    }else
    console.error('User data is null or token is not JWT.');
  }

  async restoreAuth(): Promise<void> {
    const accessToken = localStorage.getItem('jwToken')|| sessionStorage.getItem('jwToken');
    const accessTokenId = localStorage.getItem('accessTokenId')|| sessionStorage.getItem('accessTokenId');
    if (accessToken && this.isJwt(accessToken) && !this.jwtHelper.isTokenExpired(accessToken)) {
      try {
        await this.validateToken(accessToken);
        this.getId;
      } catch (error) {
        this.router.navigate(['/'])
        console.warn('Errore durante la validazione del token:', error);
      }
    } else if(accessToken&&accessTokenId && this.isIdJwt(accessTokenId) && !this.jwtHelper.isTokenExpired(accessTokenId)) {
        try {
          await this.validateToken(accessToken);
          this.getId;
        } catch (error) {
          this.router.navigate(['/'])
          console.warn('Errore durante la validazione del token:', error);
        }
    }else
    {      this.router.navigate(['/'])
      console.warn('Token non JWT rilevato o token scaduto');
      this.authChecked$.next(true);
    }
  }

  private async validateToken(token: string): Promise<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    try {
      const dataResponse = await this.http.get<AuthData>(`${this.apiURL}auth/validate-token`, { headers }).toPromise();
      if (dataResponse && dataResponse.jwToken) {
        this.authSub.next(dataResponse);
        this.autoLogout(dataResponse);
       console.log('Token valido:', dataResponse);
      }
      this.authChecked$.next(true);
    } catch (error) {
      console.error('Token non valido o errore durante la validazione:', error);
      this.removeToken();
      this.authChecked$.next(true);
      throw error;
    }
  }

  logout(): void {
    this.removeToken();
    this.authSub.next(null);
    this.router.navigate(['/']).then(() => {
      // Dopo la navigazione, fai il reload della pagina
      window.location.reload();
    })
    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }
    
  }

  private handleError(error: any): Observable<never> {
    console.error('Errore durante la richiesta:', error);
    let errorMessage = 'Si è verificato un errore.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Errore: ${error.error.message}`;
    } else {
      errorMessage = `Errore ${error.status}: ${error.message}`;
      if (error.error.details) {
        errorMessage += ` - Dettagli: ${error.error.details}`;
      }
    }
    return throwError(errorMessage);
  }

  private setToken(token: string, rememberMe: boolean): void {
    if (rememberMe) {
      localStorage.setItem('jwToken', token);
    } else {
      sessionStorage.setItem('jwToken', token);
      /* this.cookieService.set('accessToken', token); */
    }
  }

  private isJwt(token: string): boolean {
    return token.split('.').length === 3;
  }
  private isIdJwt(token: string): boolean {
    console.log('Auto logout:', token.length);
    return token.split('.').length === 3;
  }

  private removeToken(): void {
    localStorage.removeItem('jwToken');
    localStorage.removeItem('accessTokenId');
    sessionStorage.removeItem('jwToken');
    sessionStorage.removeItem('accessTokenid');
   /*  this.cookieService.delete('accessToken'); */
  }
}