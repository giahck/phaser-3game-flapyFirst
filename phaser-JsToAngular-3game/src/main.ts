
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AuthService } from './app/auth/auth.service';
import { importProvidersFrom } from '@angular/core';
import { TokenInterceptor } from './app/auth/token.interceptor';



bootstrapApplication(AppComponent, {
  providers: [
    AuthService,
    provideRouter(routes),
    importProvidersFrom(),
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    provideHttpClient(withInterceptorsFromDi())
  ],
})
.catch(err => console.error(err));

