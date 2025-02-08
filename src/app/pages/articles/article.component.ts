import { Component, OnInit, OnDestroy, Input, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ColDef, GridOptions } from 'ag-grid-community';

import { EventBusService } from '../../_services/event-bus.service';
import { AgGridModule } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';
import { Article, ArticleResponse } from '../../models/articles.model';
import { ArticleService } from '../../_services/articles.service';
import { ActionCellRendererComponent } from './render-button/render-buttons.component';
import { Router } from '@angular/router';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
  standalone: true,
  imports: [CommonModule, AgGridModule, FontAwesomeModule],
})
@Injectable()
export class ArticleComponent implements OnInit, OnDestroy {
  faPlus = faPlus;
  articles: Article[] = [];
  totalElements = 0;
  currentPage = 0;
  pageSize = 10;
  gridApi: any;
  @Input() articleId = '';
  readonly subscriptions: Subscription[] = [];

  columnDefs: ColDef<Article>[] = [];
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
    readonly articleService: ArticleService,
    readonly snackBar: MatSnackBar,
    readonly eventBus: EventBusService,
    readonly breakpointObserver: BreakpointObserver,
    private router: Router // Injected Router for navigation
  ) {}

  ngOnInit(): void {
    this.initializeGridColumns();
    this.loadArticles();
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
  createArticle(): void {
    this.router.navigate(['/articles/create']);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  initializeGridColumns(): void {
    this.columnDefs = [
      {
        headerName: 'Title',
        field: 'title',
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
        headerName: 'Category',
        field: 'category',
        sortable: true,
        filter: true,
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
      hide: col.field !== 'title', // Show only "Title" for smaller screens
    }));
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.loadArticles();
  }

  loadArticles(): void {
    this.subscriptions.push(
      this.articleService
        .getAllArticles(this.currentPage, this.pageSize)
        .subscribe({
          next: (response: ArticleResponse) => {
            this.articles = response.content;
            this.totalElements = response.totalElements;
          },
          error: () => this.showError('Error loading articles'),
        })
    );
  }

  openArticle(article: Article): void {
    this.router.navigate([`/article/details/${article.id}`, article.id]);
  }

  manageEvents(): void {
    this.subscriptions.push(
      this.eventBus.events$.subscribe((event) => {
        if (event === 'announcement-change') {
          this.loadArticles();
        }
      })
    );
  }
  deleteArticle(): void {
    this.articleService
      .deleteArticle(this.articleId)
      .subscribe((response: any) => {
        if (response) {
          this.eventBus.events$.subscribe((event) => {
            if (event === 'announcement-change') {
              this.loadArticles();
            }
          });
        }
      });
  }
  showError(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}
