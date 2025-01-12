import { Component } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ICellRendererAngularComp } from 'ag-grid-angular';
@Component({
  selector: 'app-render-buttons',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './render-buttons.component.html',
  styleUrl: './render-buttons.component.css',
})
export class ActionCellRendererComponent implements ICellRendererAngularComp {
  params!: any;
  faPen = faPen;
  faTrash = faTrash;
  componentParent: any;
  agInit(params: any): void {
    this.params = params;
    this.componentParent = this.params.context.componentParent;
  }

  refresh(): boolean {
    return false;
  }

  openEditDialog(): void {
    if (this.params.context && this.params.context.openDialog) {
      this.params.context.openDialog(this.params.data);
    } else {
      console.error('openDialog method not found in the context');
    }
  }
  deleteAnnouncement(): void {
    if (this.params.context && this.params.context.deleteAnnouncement) {
      this.params.context.deleteAnnouncement(this.params.data.id);
    } else {
      console.error('openDialog method not found in the context');
    }
  }
}
