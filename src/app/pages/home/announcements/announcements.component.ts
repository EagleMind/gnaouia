import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import moment from 'moment';
import { ColDef, GridOptions } from 'ag-grid-community';

import { AnnouncementDialogComponent } from './announcements-modal/modal.component';
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
  totalElements = 0;
  currentPage = 0;
  pageSize = 10;
  gridApi: any;
  @Input() announcementId = '';
  private subscriptions: Subscription[] = [];

  columnDefs: ColDef<Announcement>[] = [];
  gridOptions: GridOptions = {
    pagination: true,
    paginationPageSize: this.pageSize,
    defaultColDef: {
      resizable: true,
      sortable: true,
      filter: true,
    },
    domLayout: 'autoHeight',
  };

  constructor(
    private dialog: MatDialog,
    private announcementService: AnnouncementService,
    private snackBar: MatSnackBar,
    private eventBus: EventBusService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.initializeGridColumns();
    this.loadAnnouncements();
    this.manageEvents();

    this.subscriptions.push(
      this.breakpointObserver
        .observe([Breakpoints.Small, Breakpoints.Handset])
        .subscribe((state) => {
          if (state.matches) {
            this.adjustColumnsForSmallScreens();
          } else {
            this.initializeGridColumns();
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private initializeGridColumns(): void {
    this.columnDefs = [
      {
        headerName: 'Name',
        field: 'name',
        sortable: true,
        filter: true,
        flex: 2,
      },
      {
        headerName: 'URL',
        field: 'url',
        sortable: true,
        filter: true,
        flex: 2,
      },
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
  }

  private adjustColumnsForSmallScreens(): void {
    this.columnDefs = this.columnDefs.map((col) => ({
      ...col,
      hide: col.field !== 'name', // Show only "Name" for smaller screens
    }));
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.loadAnnouncements();
  }

  loadAnnouncements(): void {
    this.subscriptions.push(
      this.announcementService
        .getAllAnnouncements(this.currentPage, this.pageSize)
        .subscribe({
          next: (response: AnnouncementsResponse) => {
            this.announcements = response.content;
            this.totalElements = response.totalElements;
          },
          error: () => this.showError('Error loading announcements'),
        })
    );
  }

  openDialog(announcement?: Announcement): void {
    const dialogRef = this.dialog.open(AnnouncementDialogComponent, {
      width: '400px',
      data: announcement || { name: '', url: '', dateFrom: '', dateTo: '' },
    });

    this.subscriptions.push(
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          result.id
            ? this.updateAnnouncement(result)
            : this.createAnnouncement(result);
        }
      })
    );
  }

  private updateAnnouncement(updatedAnnouncement: Announcement): void {
    this.subscriptions.push(
      this.announcementService
        .updateAnnouncement(updatedAnnouncement.id, updatedAnnouncement)
        .subscribe({
          next: () => {
            this.loadAnnouncements();
            this.snackBar.open('Announcement updated successfully', 'Close', {
              duration: 3000,
            });
          },
          error: () => this.showError('Error updating announcement'),
        })
    );
  }

  private createAnnouncement(newAnnouncement: FormData): void {
    this.subscriptions.push(
      this.announcementService.createAnnouncement(newAnnouncement).subscribe({
        next: () => {
          this.loadAnnouncements();
          this.snackBar.open('Announcement created successfully', 'Close', {
            duration: 3000,
          });
        },
        error: () => this.showError('Error creating announcement'),
      })
    );
  }

  private manageEvents(): void {
    this.subscriptions.push(
      this.eventBus.events$.subscribe((event) => {
        if (event === 'announcement-change') {
          this.loadAnnouncements();
        }
      })
    );
  }

  private formatDate(
    date: string | Date,
    format: string = 'MMMM Do YYYY'
  ): string {
    return moment(date).format(format);
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}
