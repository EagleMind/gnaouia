import { Component, OnInit, OnDestroy, Input, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import moment from 'moment';
import { ColDef, GridOptions } from 'ag-grid-community';
import { MerchandiseDialogComponent } from './merchandise-modal/modal.component';

import { ActionCellRendererComponent } from './render-button/render-buttons.component';
import {
  Merchandise,
  MerchandiseResponse,
} from '../../models/merchandise.model';
import { MerchandiseService } from '../../_services/merchandise';
import { EventBusService } from '../../_services/event-bus.service';
import { CommonModule } from '@angular/common';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';

@Component({
  selector: 'app-merchandise',
  templateUrl: './merchandise.component.html',
  styleUrls: ['./merchandise.component.css'],
  standalone: true,
  imports: [CommonModule, AgGridModule, AgGridAngular],
})
@Injectable()
export class MerchandiseComponent implements OnInit, OnDestroy {
  merchandise: Merchandise[] = [];
  totalElements = 0;
  currentPage = 0;
  pageSize = 10;
  gridApi: any;
  @Input() merchandiseId = '';
  private subscriptions: Subscription[] = [];

  columnDefs: ColDef<Merchandise>[] = [];
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
    private merchandiseService: MerchandiseService,
    private snackBar: MatSnackBar,
    private eventBus: EventBusService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.initializeGridColumns();
    this.loadMerchandises();
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
        headerName: 'Original Price',
        field: 'originalPrice',
        sortable: true,
        filter: true,
        valueFormatter: (params) => this.formatDate(params.value),
      },
      {
        headerName: 'Discount',
        field: 'discount',
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
    this.loadMerchandises();
  }

  loadMerchandises(): void {
    this.subscriptions.push(
      this.merchandiseService
        .getAllMerchandise(this.currentPage, this.pageSize)
        .subscribe({
          next: (response: MerchandiseResponse) => {
            this.merchandise = response.content;
            this.totalElements = response.totalElements;
          },
          error: () => this.showError('Error loading Merchandises'),
        })
    );
  }

  openDialog(Merchandise?: Merchandise): void {
    const dialogRef = this.dialog.open(MerchandiseDialogComponent, {
      width: '400px',
      data: Merchandise || {
        name: '',
        url: '',
        originalPrice: 0,
        discount: 0,
        pictureUrl: '',
      },
    });

    this.subscriptions.push(
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          result.id
            ? this.updateMerchandise(result)
            : this.createMerchandise(result);
        }
      })
    );
  }

  private updateMerchandise(updatedMerchandise: Merchandise): void {
    this.subscriptions.push(
      this.merchandiseService
        .updateMerchandise(updatedMerchandise.id, updatedMerchandise)
        .subscribe({
          next: () => {
            this.loadMerchandises();
            this.snackBar.open('Merchandise updated successfully', 'Close', {
              duration: 3000,
            });
          },
          error: () => this.showError('Error updating Merchandise'),
        })
    );
  }

  private createMerchandise(newMerchandise: FormData): void {
    this.subscriptions.push(
      this.merchandiseService.createMerchandise(newMerchandise).subscribe({
        next: () => {
          this.loadMerchandises();
          this.snackBar.open('Merchandise created successfully', 'Close', {
            duration: 3000,
          });
        },
        error: () => this.showError('Error creating Merchandise'),
      })
    );
  }

  private manageEvents(): void {
    this.subscriptions.push(
      this.eventBus.events$.subscribe((event) => {
        if (event === 'Merchandise-change') {
          this.loadMerchandises();
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
