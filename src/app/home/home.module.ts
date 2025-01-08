import { NgModule } from '@angular/core';

import { HomeRoutingModule } from './home-routing.module';
import { homeComponent } from './home.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [homeComponent, AnnouncementsComponent],
  imports: [HomeRoutingModule, FontAwesomeModule],
})
export class HomeModule {}
