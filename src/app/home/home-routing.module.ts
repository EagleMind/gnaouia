import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { homeComponent } from './home.component';
import { UserRoleGuard } from '../security/guards/user-role.guard';
import { AnnouncementsComponent } from './announcements/announcements.component';

export const routes: Routes = [
  {
    path: '',
    component: homeComponent,
    canActivate: [UserRoleGuard],
    children: [
      {
        path: 'annnouncements',
        component: AnnouncementsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
