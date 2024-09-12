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
  private jwtHelper = new JwtHelperService();
  private timeOut: any;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {}

  getId(): number | null{
    const user=this.authSub.getValue();
    return user ? user.id : null;
  }
  get(url: string): Observable<any> {
    return this.http.get("http://localhost:8080" + url);
  }
  getToken(code: string): Observable<boolean> {
    return this.http.get<Token>(`http://localhost:8080/auth/callback?code=${code}`, { observe: 'response' })
      .pipe(
        map((response: HttpResponse<Token>) => {
          if (response.status === 200 && response.body) {
            const { idToken, accessToken } = response.body;

            console.log('Token Response:', response);

            if (this.isJwt(idToken)) {
              localStorage.setItem('accessToken', idToken);
              this.cookieService.set('accessToken', idToken);

              this.http.get<AuthData>('http://localhost:8080/messages', {
                headers: new HttpHeaders({ 'Authorization': `Bearer ${accessToken}` }),
                observe: 'response'
              }).subscribe((messageResponse: HttpResponse<AuthData>) => {
                if (messageResponse.body) {
                  this.authSub.next(messageResponse.body);
                  messageResponse.body.accessToken = idToken;
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
        if (dataResponse && dataResponse.accessToken) {
          this.setToken(dataResponse.accessToken, dataResponse.rememberMe);
          this.authSub.next(dataResponse);
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
    if (user && this.isJwt(user.accessToken)) {
    //  console.log('Auto logout:', user);
      const expirationDate = this.jwtHelper.getTokenExpirationDate(user.accessToken) as Date;
      const millisecondsExp = expirationDate.getTime() - new Date().getTime();
      this.timeOut = setTimeout(() => this.logout(), millisecondsExp);
    } else {
      console.error('User data is null or token is not JWT.');
    }
  }

  async restoreAuth(): Promise<void> {
    const accessToken = localStorage.getItem('accessToken') || this.cookieService.get('accessToken');
    if (accessToken && this.isJwt(accessToken) && !this.jwtHelper.isTokenExpired(accessToken)) {
      try {
        await this.validateToken(accessToken);
      } catch (error) {
        console.warn('Errore durante la validazione del token:', error);
      }
    } else {
      console.warn('Token non JWT rilevato o token scaduto');
      this.authChecked$.next(true);
    }
  }

  private async validateToken(token: string): Promise<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    try {
      const dataResponse = await this.http.get<AuthData>(`${this.apiURL}auth/validate-token`, { headers }).toPromise();
      if (dataResponse && dataResponse.accessToken) {
        this.authSub.next(dataResponse);
        this.autoLogout(dataResponse);
       // console.log('Token valido:', dataResponse);
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
    this.router.navigate(['/home']);
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
      localStorage.setItem('accessToken', token);
    } else {
      this.cookieService.set('accessToken', token);
    }
  }

  private isJwt(token: string): boolean {
    return token.split('.').length === 3;
  }

  private removeToken(): void {
    localStorage.removeItem('accessToken');
    this.cookieService.delete('accessToken');
  }
}