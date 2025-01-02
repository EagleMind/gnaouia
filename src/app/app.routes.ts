import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: AppComponent,
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: '**', redirectTo: 'login' },
];
