import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, catchError, lastValueFrom, Observable, tap, throwError } from 'rxjs';
import { Cv } from '../models/cv/cv.interface';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CvService {
  apiUrl=environment.apiURL;
  private cvUser = new BehaviorSubject<Cv>({} as Cv);
  cvUser$ = this.cvUser.asObservable();
  private isLoaded = false;
  constructor(private http:HttpClient,private user:AuthService) { }
  getCV$(): Cv {
    return this.cvUser.getValue();
  }
  setCV(cv: Cv): void {
    this.cvUser.next(cv);
    this.isLoaded = true; 
  }
  async getCV(): Promise<void> {
    if (this.isLoaded) {
      return;
    }
    await this.user.restoreAuth();

    const userId = this.user.getId;
    if (!userId) {
      console.error('User ID is null');
      return;
    }

    try {
      const cv = await lastValueFrom(this.http.get<Cv>(`${this.apiUrl}cv/${userId}`));
      this.setCV(cv);
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.handleError(error);
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }
  }
  postCv(cv: Cv):Observable<Cv>{
    console.log(cv);
    return this.http.post<Cv>(`${this.apiUrl}cv/save`, cv).pipe(
      tap((cv: Cv) => {this.setCV(cv);}),
      catchError(this.handleError)
    );
    
  }


    private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Si è verificato un errore sconosciuto!';
    if (error.error instanceof Error) {
      // Errore del client-side o di rete
      console.error('Errore:', error.error.message);
      errorMessage = `Errore del client-side o di rete: ${error.error.message}`;
    } else {
      // Errore dal lato del server
      console.error(
        `Codice Errore dal lato server ${error.status}, ` +
        `messaggio di errore: ${error.message}`
      );
      errorMessage = `Errore dal lato server: ${error.status}, messaggio di errore: ${error.message}`;
    }
    // Ritorna un observable con un messaggio di errore utile per il consumatore del servizio
    return throwError(errorMessage);
  }


}
