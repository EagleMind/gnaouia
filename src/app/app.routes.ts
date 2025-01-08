import { Routes } from '@angular/router';
import { AuthGuard } from './security/guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { NoAuthGuard } from './security/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./home/home.module').then((homeModule) => homeModule.HomeModule),
  },
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },

  { path: '**', redirectTo: 'login' },
];
