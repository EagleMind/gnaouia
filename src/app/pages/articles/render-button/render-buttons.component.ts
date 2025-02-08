import { Component } from '@angular/core';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Router } from '@angular/router';
import { ArticleDialogComponent } from '../article-modal/modal.component';
import { MatDialog } from '@angular/material/dialog';

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
  faTrash = faTrash;
  componentParent: any;
  articleId: string | null = null;

  constructor(private router: Router, private dialog: MatDialog) {}

  agInit(params: any): void {
    this.params = params;
    this.componentParent = this.params.context.componentParent;
  }

  refresh(): boolean {
    return false;
  }
  openDialog(id?: ArticleDialogComponent): void {
    const dialogRef = this.dialog.open(ArticleDialogComponent, {
      width: '400px',
      data: {
        id: id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
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
