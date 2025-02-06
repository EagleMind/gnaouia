import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ArticleService } from '../../_services/articles.service';
import { LazyLoadEvent } from 'primeng/api';

export interface Article {
  id: string;
  title: string;
  url: string;
  text: number;
  category: number;
}

interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface ArticleResponse {
  content: Article[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
})
export class ArticlesComponent implements OnInit, OnDestroy {
  articles: Article[] = [];
  totalElements = 0;
  currentPage = 0;
  pageSize = 10;
  @Input() articleId = '';
  readonly subscriptions: Subscription[] = [];

  constructor(
    readonly dialog: MatDialog,
    readonly articleService: ArticleService,
    readonly snackBar: MatSnackBar,
    readonly eventBus: EventBusService,
    readonly breakpointObserver: BreakpointObserver,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMerchandises();
    this.manageEvents();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  loadMerchandises(event?: LazyLoadEvent): void {
    if (event) {
      this.currentPage = event.first! / event.rows!;
      this.pageSize = event.rows!;
    }

    this.subscriptions.push(
      this.articleService
        .getAllMerchandise(this.currentPage, this.pageSize)
        .subscribe({
          next: (response: ArticleResponse) => {
            this.articles = response.content;
            this.totalElements = response.totalElements;
          },
          error: () => this.showError('Error loading Merchandises'),
        })
    );
  }

  manageEvents(): void {
    this.subscriptions.push(
      this.eventBus.events$.subscribe((event) => {
        if (event === 'Merchandise-change') {
          this.loadMerchandises();
        }
      })
    );
  }

  viewArticle(articleId: string): void {
    this.router.navigate(['/article-details', articleId]);
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}
