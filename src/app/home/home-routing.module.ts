import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { homeComponent } from './home.component';
import { UserRoleGuard } from '../security/guards/user-role.guard';
import { AnnouncementsModule } from './announcements/announcements.module';

export const routes: Routes = [
  {
    path: '',
    component: homeComponent,
    canActivate: [UserRoleGuard],
    children: [
      {
        path: 'annnouncements',
        component: AnnouncementsModule,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
