import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AnnouncementDialogComponent } from './announcements-modal/modal.component';
import { Subscription } from 'rxjs';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { ColDef, ColGroupDef, GridOptions } from 'ag-grid-community';
import {
  Announcement,
  AnnouncementsResponse,
} from '../../../models/announcements.model';
import { AnnouncementService } from '../../../_services/announcements';
import { EventBusService } from '../../../_services/event-bus.service';
import { ActionCellRendererComponent } from './render-button/render-buttons.component';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.css'],
})
export class AnnouncementsComponent implements OnInit, OnDestroy {
  announcements: Announcement[] = [];
  totalElements: number = 0;
  currentPage: number = 0;
  pageSize: number = 2;
  gridApi: any;
  columnDefs: (ColDef<Announcement> | ColGroupDef<Announcement>)[] = [
    { headerName: 'Name', field: 'name', sortable: true, filter: true },
    { headerName: 'URL', field: 'url', sortable: true, filter: true },
    {
      headerName: 'Date From',
      field: 'dateFrom',
      sortable: true,
      filter: true,
      valueFormatter: (params) => this.formatDate(params.value),
    },
    {
      headerName: 'Date To',
      field: 'dateTo',
      sortable: true,
      filter: true,
      valueFormatter: (params) => this.formatDate(params.value),
    },
    {
      headerName: 'Actions',
      cellRenderer: ActionCellRendererComponent,
      cellRendererParams: {
        context: this,
      },
    },
  ];

  gridOptions: GridOptions = {
    pagination: true,
    paginationPageSize: this.pageSize,
    defaultColDef: {
      resizable: true,
      sortable: true,
      filter: true,
    },
  };

  private subscriptions: Subscription[] = [];
  faPen = faPen;
  faTrash = faTrash;

  constructor(
    private dialog: MatDialog,
    private announcementService: AnnouncementService,
    private snackBar: MatSnackBar,
    private eventBus: EventBusService
  ) {}

  ngOnInit(): void {
    this.loadAnnouncements();
    this.subscriptions.push(
      this.eventBus.events$.subscribe((event) => {
        if (event === 'announcement-change') {
          this.loadAnnouncements();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.loadAnnouncements();
  }

  loadAnnouncements(): void {
    const subscription = this.announcementService
      .getAllAnnouncements(this.currentPage, this.pageSize)
      .subscribe({
        next: (response: AnnouncementsResponse) => {
          this.announcements = response.content;
          this.totalElements = response.totalElements;
        },
        error: () => this.showError('Error loading announcements'),
      });
    this.subscriptions.push(subscription);
  }

  formatDate(date: string | Date, format: string = 'MMMM Do YYYY'): string {
    return moment(date).format(format);
  }

  openDialog(announcement?: Announcement): void {
    const dialogRef = this.dialog.open(AnnouncementDialogComponent, {
      width: '400px',
      data: announcement || { name: '', url: '', dateFrom: '', dateTo: '' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        result.id
          ? this.updateAnnouncement(result)
          : this.createAnnouncement(result);
      }
    });
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
        error: () => this.showError('Error updating announcement'),
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
        error: () => this.showError('Error creating announcement'),
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
        error: () => this.showError('Error deleting announcement'),
      });
    this.subscriptions.push(subscription);
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}
