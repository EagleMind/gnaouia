import { Routes } from '@angular/router';
import { AuthGuard } from './security/guards/auth.guard';
import { NoAuthGuard } from './security/guards/no-auth.guard';
import {LoginComponent} from "./pages/login/login.component";

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/home/home.module').then((homeModule) => homeModule.HomeModule),
  },

  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },

  { path: '**', redirectTo: 'login' },
];
