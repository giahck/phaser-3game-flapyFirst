import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit,OnDestroy {
  private subscriptions: Subscription[] = [];
  isRightPanelActive = true;
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  url: string = "";
  constructor(
    private fb: FormBuilder,
    private authSrv: AuthService,
  
  ) {}
  ngOnInit(): void {
    
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nome: ['', [Validators.required]],
      cognome: ['', [Validators.required]],
      rememberMe: [false],
    });

    this.authSrv.get("/auth/url").subscribe((data: any) => this.url = data.authURL);
   
  }
  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      const loginSub = this.authSrv.login(this.loginForm.value).subscribe((authData) => {
        //  console.log(authData);
      });
      this.subscriptions.push(loginSub);
      //  console.log(this.loginForm.value);
    } else {
      // Gestione degli errori
      console.log('Form non valido');
    }
  }
  
  onRegisterSubmit(): void {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      const registerSub = this.authSrv.register(this.registerForm.value).subscribe((authData) => {
        console.log(authData);
      });
      this.subscriptions.push(registerSub);
    } else {
      // Gestione degli errori
      console.log('Form non valido');
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onSignUp(): void {
    this.isRightPanelActive = false;
  }

  onSignIn(): void {
    this.isRightPanelActive = true;
  }
}
