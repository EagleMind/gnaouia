import { Component } from '@angular/core';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { MatDialog } from '@angular/material/dialog';
import { MerchandiseDialogComponent } from '../merchandise-modal/modal.component';
import { Merchandise } from '../../../models/merchandise.model';
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
  selectedMerchantId: string | null = null;
  constructor(private dialog: MatDialog) {}
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
  // deleteAnnouncement(): void {
  //   if (this.params.context && this.params.context.deleteAnnouncement) {
  //     this.params.context.deleteAnnouncement(this.params.data.id);
  //   } else {
  //     console.error('openDialog method not found in the context');
  //   }
  // }
  openDialog(announcement?: Merchandise, isDelete?: boolean): void {
    console.log(isDelete);
    const dialogRef = this.dialog.open(MerchandiseDialogComponent, {
      width: '400px',
      data: {
        id: announcement,
        isDelete: isDelete,
        name: '',
        url: '',
        dateFrom: '',
        dateTo: '',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
  deleteMerchant(id: string): void {
    this.selectedMerchantId = id;
    const modal = document.getElementById('popup-modal');
    if (modal) {
      modal.classList.toggle('hidden');
      modal.classList.toggle('flex'); // Assuming you want to display it as a flex container when shown
    }
  }
}
