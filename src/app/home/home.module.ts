import { NgModule } from '@angular/core';

import { HomeRoutingModule } from './home-routing.module';
import { homeComponent } from './home.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AnnouncementsComponent } from './announcements/announcements.component';

@NgModule({
  declarations: [homeComponent, AnnouncementsComponent],
   imports: [HomeRoutingModule],
})
export class HomeModule {}
