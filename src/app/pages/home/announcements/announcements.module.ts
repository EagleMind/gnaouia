import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { AnnouncementsComponent } from './announcements.component';

@NgModule({
  declarations: [AnnouncementsComponent],
  imports: [CommonModule, AgGridModule, AgGridAngular],
  exports: [
    AnnouncementsComponent
  ]
})
export class AnnouncementsModule {}
