import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { AnnouncementsComponent } from './announcements/announcements.component';

@NgModule({
  declarations: [AnnouncementsComponent],
  imports: [CommonModule, AgGridModule, AgGridAngular],
})
export class AnnouncementsModule {}
