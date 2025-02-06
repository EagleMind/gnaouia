import { Component, OnInit, OnDestroy, Input, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import moment from 'moment';
import { ColDef, GridOptions } from 'ag-grid-community';
import { ModuleRegistry } from '@ag-grid-community/core'; // Import ModuleRegistry
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { AnnouncementDialogComponent } from './announcements-modal/modal.component';
import {
  Announcement,
  AnnouncementsResponse,
} from '../../models/announcements.model';
import { AnnouncementService } from '../../_services/announcements';
import { EventBusService } from '../../_services/event-bus.service';
import { ActionCellRendererComponent } from './render-button/render-buttons.component';
import { AgGridModule } from 'ag-grid-angular'; // Import AgGridModule
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-announcements',
    templateUrl: './announcements.component.html',
    styleUrls: ['./announcements.component.css'],
    imports: [CommonModule, AgGridModule]
})
@Injectable()
export class AnnouncementsComponent implements OnInit, OnDestroy {
  announcements: Announcement[] = [];
  totalElements = 0;
  currentPage = 0;
  pageSize = 10;
  gridApi: any;
  @Input() announcementId = '';
  readonly subscriptions: Subscription[] = [];

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
    readonly dialog: MatDialog,
    readonly announcementService: AnnouncementService,
    readonly snackBar: MatSnackBar,
    readonly eventBus: EventBusService,
    readonly breakpointObserver: BreakpointObserver
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

  initializeGridColumns(): void {
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

  adjustColumnsForSmallScreens(): void {
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
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadAnnouncements();
      }
    });
  }

  manageEvents(): void {
    this.subscriptions.push(
      this.eventBus.events$.subscribe((event) => {
        if (event === 'announcement-change') {
          this.loadAnnouncements();
        }
      })
    );
  }

  formatDate(date: string | Date, format: string = 'MMMM Do YYYY'): string {
    return moment(date).format(format);
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}
