import { Component } from '@angular/core';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-render-buttons',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './render-buttons.component.html',
  styleUrl: './render-buttons.component.css',
})
export class ActionCellRendererComponent {
  params: any;
  faPen = 'pen'; // FontAwesome icon
  faTrash = 'trash'; // FontAwesome icon
  constructor(private library: FaIconLibrary) {
    this.library.addIcons(faPen, faPlus);
  }
  agInit(params: any): void {
    this.params = params;
  }

  onEdit(): void {
    this.params.onEdit(this.params.data); // Call the provided edit function
  }

  onDelete(): void {
    this.params.onDelete(this.params.data.id); // Call the provided delete function
  }
}
