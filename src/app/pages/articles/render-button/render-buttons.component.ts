import { Component } from '@angular/core';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Router } from '@angular/router';
import { Article } from '../../../models/articles.model';

@Component({
  selector: 'app-render-buttons',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './render-buttons.component.html',
  styleUrls: ['./render-buttons.component.css'],
})
export class ActionCellRendererComponent implements ICellRendererAngularComp {
  params!: any;
  faEye = faEye;
  componentParent: any;
  selectedArticleId: string | null = null;

  constructor(private router: Router) {}

  agInit(params: any): void {
    this.params = params;
    this.componentParent = this.params.context.componentParent;
  }

  refresh(): boolean {
    return false;
  }

  openArticle(event: Event): void {
    event.stopPropagation();
    const articleId = this.params.data.id;
    if (articleId) {
      this.router.navigate([`/articles/details/${articleId}`]); // Corrected navigation path
    } else {
      console.error('Article ID not found');
    }
  }
}
