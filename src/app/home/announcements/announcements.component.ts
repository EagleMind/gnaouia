import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar'; // For error/snackbar handling
import { AnnouncementDialogComponent } from './components/modal/modal.component';
import { AnnouncementService } from '../../_services/announcements';
import { Announcement } from '../../models/announcements.model';
import { Subscription } from 'rxjs';
import { EventBusService } from '../../_services/event-bus.service';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.css'],
})
export class AnnouncementsComponent implements OnInit, OnDestroy {
  announcements: Announcement[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private dialog: MatDialog,
    private announcementService: AnnouncementService,
    private snackBar: MatSnackBar,
    private eventBus: EventBusService
  ) {}

  ngOnInit(): void {
    this.loadAnnouncements();
    this.eventBus.events$.subscribe((event) => {
      if (event) {
        if (event === 'announcement-change') {
          this.announcementService.getAllAnnouncements().subscribe({
            next: (data: Announcement[]) => (this.announcements = data),
            error: (err) => this.showError('Error loading announcements'),
          });
        }
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  loadAnnouncements(): void {
    const subscription = this.announcementService
      .getAllAnnouncements()
      .subscribe({
        next: (data: Announcement[]) => (this.announcements = data),
        error: (err) => this.showError('Error loading announcements'),
      });
    this.subscriptions.push(subscription);
  }

  openDialog(announcement?: Announcement): void {
    const dialogRef = this.dialog.open(AnnouncementDialogComponent, {
      width: '400px',
      data: announcement || { name: '', url: '', dateFrom: '', dateTo: '' },
    });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //     if (result.id) {
    //       this.updateAnnouncement(result);
    //     } else {
    //       this.createAnnouncement(result);
    //     }
    //   }
    // });
  }

  updateAnnouncement(updatedAnnouncement: Announcement): void {
    const subscription = this.announcementService
      .updateAnnouncement(updatedAnnouncement.id, updatedAnnouncement)
      .subscribe({
        next: () => {
          this.loadAnnouncements();
          this.snackBar.open('Announcement updated successfully', 'Close', {
            duration: 3000,
          });
        },
        error: (err) => this.showError('Error updating announcement'),
      });
    this.subscriptions.push(subscription);
  }

  createAnnouncement(newAnnouncement: FormData): void {
    const subscription = this.announcementService
      .createAnnouncement(newAnnouncement)
      .subscribe({
        next: () => {
          this.loadAnnouncements();
          this.snackBar.open('Announcement created successfully', 'Close', {
            duration: 3000,
          });
        },
        error: (err) => this.showError('Error creating announcement'),
      });
    this.subscriptions.push(subscription);
  }

  deleteAnnouncement(id: string): void {
    const subscription = this.announcementService
      .deleteAnnouncement(id)
      .subscribe({
        next: () => {
          this.loadAnnouncements();
          this.snackBar.open('Announcement deleted successfully', 'Close', {
            duration: 3000,
          });
        },
        error: (err) => this.showError('Error deleting announcement'),
      });
    this.subscriptions.push(subscription);
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}
