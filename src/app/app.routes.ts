import { Routes } from '@angular/router';
import { AuthGuard } from './security/guards/auth.guard';
import { NoAuthGuard } from './security/guards/no-auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { AnnouncementsComponent } from './pages/announcements/announcements.component';
import { MerchandiseComponent } from './pages/merchandise/merchandise.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: AnnouncementsComponent,
    data: { title: 'Home' },
  },

  {
    path: 'announcements',
    canActivate: [AuthGuard],
    component: AnnouncementsComponent,
    data: { title: 'Announcements' },
  },
  {
    path: 'merchandise',
    canActivate: [AuthGuard],
    component: MerchandiseComponent,
    data: { title: 'Merchandise' },
  },
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },

  { path: '**', redirectTo: 'login' },
];
