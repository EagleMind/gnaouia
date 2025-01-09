import { Component } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
@Component({
  selector: 'app-render-buttons',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './render-buttons.component.html',
  styleUrl: './render-buttons.component.css',
})
export class ActionCellRendererComponent {
  params!: any;
  faPen = faPen;
  faTrash = faTrash;
  constructor(private FontAwesomeModule: FaIconLibrary) {
    this.FontAwesomeModule.addIcons(faPen, faTrash);
  }
  agInit(params: any): void {
    this.params = params;
  }

  edit() {
    // Call the edit function in AnnouncementsComponent with the current row data
    this.params.context.componentParent.openDialog(this.params.data);
  }

  delete() {
    // Call the delete function in AnnouncementsComponent with the current row data id
    if (confirm('Are you sure you want to delete?')) {
      this.params.context.componentParent.deleteAnnouncement(
        this.params.data.id
      );
    }
  }
}
