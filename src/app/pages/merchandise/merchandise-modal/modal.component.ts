import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnInit,
  ChangeDetectorRef,
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
import {
  faPlus,
  faCheck,
  faTrash,
  faXmarkCircle,
} from '@fortawesome/free-solid-svg-icons';
import { EventBusService } from '../../../_services/event-bus.service';
import { MerchandiseService } from '../../../_services/merchandise';

@Component({
  selector: 'app-announcement-dialog',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  standalone: true,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchandiseDialogComponent {
  faPlus = faPlus;
  faCheck = faCheck;
  faTrash = faTrash;
  faXmarkCircle = faXmarkCircle;
  selectedFile: File | null = null;
  form: FormGroup;
  isEditMode: boolean = false;
  isDeleteMode: boolean = false;

  constructor(
    readonly eventBusService: EventBusService,
    readonly merchandiseService: MerchandiseService,
    public dialogRef: MatDialogRef<MerchandiseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdRef: ChangeDetectorRef
  ) {
    this.form = new FormGroup({
      name: new FormControl(data?.name || '', [
        Validators.required,
        Validators.pattern('^[a-zA-Z ]*$'),
      ]),
      url: new FormControl(data?.url || '', [Validators.required]),
      originalPrice: new FormControl(data?.originalPrice || null, [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
      ]),
      discount: new FormControl(data?.discount || null, [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
      ]),
      pictureUrl: new FormControl(data?.pictureUrl || null, [
        Validators.required,
      ]),
    });
    this.isEditMode = !!this.data.id && !this.data?.isDelete;
    this.isDeleteMode = !!this.data?.isDelete;
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.data.pictureUrl = e.target.result;
        this.form.patchValue({ pictureUrl: e.target.result });
        this.cdRef.detectChanges();
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  removeSelectedImage(): void {
    this.selectedFile = null;
    this.data.pictureUrl = null;
    this.form.patchValue({ pictureUrl: null });
    this.cdRef.detectChanges();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(event: Event): void {
    event.preventDefault();
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

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
