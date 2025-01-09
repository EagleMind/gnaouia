import { NgModule } from '@angular/core';

import { HomeRoutingModule } from './home-routing.module';
import { homeComponent } from './home.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AnnouncementsModule } from './announcements/announcements.module';

ModuleRegistry.registerModules([AllCommunityModule]);
@NgModule({
  declarations: [homeComponent],
  imports: [HomeRoutingModule, FontAwesomeModule, AnnouncementsModule],
})
export class HomeModule {}
