import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faPlus, faCheck } from '@fortawesome/free-solid-svg-icons';
import { EventBusService } from '../../../_services/event-bus.service';
import { MerchandiseService } from '../../../_services/merchandise';

@Component({
    selector: 'app-announcement-dialog',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css'],
    imports: [
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatButtonModule,
        CommonModule,
        ReactiveFormsModule,
        FontAwesomeModule,
    ],
    providers: [provideNativeDateAdapter()],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MerchandiseDialogComponent implements OnInit {
  faPlus = faPlus;
  faCheck = faCheck;
  selectedFile: File | null = null;
  form: FormGroup;
  isEditMode: boolean = false;
  isDeleteMode: boolean = false;

  constructor(
    readonly eventBusService: EventBusService,
    readonly merchandiseService: MerchandiseService,
    public dialogRef: MatDialogRef<MerchandiseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = new FormGroup({
      name: new FormControl(data?.name || '', [Validators.required]),
      url: new FormControl(data?.url || '', [Validators.required]),
      originalPrice: new FormControl(data?.originalPrice || null),
      discount: new FormControl(data?.discount || null),
      pictureUrl: new FormControl(data?.pictureUrl || null),
    });
    this.isEditMode = !!this.data.id && !this.data?.isDelete; // Ensures edit mode is only set if not in delete mode
    this.isDeleteMode = !!this.data?.isDelete; // Ensures delete mode is properly set
  }
  ngOnInit(): void {}
  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.data.pictureUrl = e.target.result;
      };

      reader.readAsDataURL(this.selectedFile);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
  onSave(event: Event): void {
    event.preventDefault(); // Prevents form from triggering multiple actions

    if (this.isDeleteMode) {
      this.deleteMerchant();
    } else if (this.isEditMode) {
      this.updateAnnouncement();
    } else {
      this.createAnnouncement();
    }
  }

  createAnnouncement(): void {
    const formData = this.prepareFormData();
    this.merchandiseService.createMerchandise(formData).subscribe({
      next: () => {
        this.dialogRef.close(true);
        this.eventBusService.emit('announcement-change');
      },
      error: (err) => console.error('Failed to create announcement', err),
    });
  }

  updateAnnouncement(): void {
    const formData = this.prepareFormData();
    this.merchandiseService
      .updateMerchandise(this.data.id, formData)
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.eventBusService.emit('announcement-change');
        },
      });
  }

  deleteMerchant(): void {
    this.merchandiseService.deleteMerchandise(this.data.id).subscribe({
      next: () => {
        this.dialogRef.close(true);
        this.eventBusService.emit('Merchandise-change');
      },
    });
  }

  prepareFormData(): FormData {
    const formData = new FormData();
    formData.append('name', this.form.value.name);
    formData.append('url', this.form.value.url);
    formData.append('originalPrice', this.form.value.originalPrice);
    formData.append('discount', this.form.value.discount);

    if (this.selectedFile) {
      formData.append('picture', this.selectedFile, this.selectedFile.name);
    }

    return formData;
  }
}
