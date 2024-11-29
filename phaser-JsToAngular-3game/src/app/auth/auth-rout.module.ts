import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutRoutingModule } from './auth-rout-routing.module';
import { LoginComponent } from './login/login.component';


@NgModule({

  imports: [
    CommonModule,
    AuthRoutRoutingModule
  ]
})
export class AuthRoutModule { }
