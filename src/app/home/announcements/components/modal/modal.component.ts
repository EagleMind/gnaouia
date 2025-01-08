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
import { AnnouncementService } from '../../../../_services/announcements';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EventBusService } from '../../../../_services/event-bus.service';

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
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnouncementDialogComponent implements OnInit {
  selectedFile: File | null = null;
  form: FormGroup;
  isEditMode: boolean = false;
  constructor(
    private EventBusService: EventBusService,
    private announcementService: AnnouncementService,
    public dialogRef: MatDialogRef<AnnouncementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = new FormGroup({
      name: new FormControl(data?.name || '', [Validators.required]),
      url: new FormControl(data?.url || '', [Validators.required]),
      dateFrom: new FormControl(data?.dateFrom || null),
      dateTo: new FormControl(data?.dateTo || null),
      picutreUrl: new FormControl(data?.pictureUrl || null),
    });
  }

  ngOnInit(): void {
    if (!this.form) {
      this.isEditMode = true;
    } else {
      this.isEditMode = false;
    }
  }

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

  onSave(): void {
    const formData = new FormData();
    console.log('mode', this.isEditMode);
    formData.append('name', this.form.value.name);
    formData.append('url', this.form.value.url);
    formData.append('dateFrom', this.formatDate(this.form.value.dateFrom));
    formData.append('dateTo', this.formatDate(this.form.value.dateTo));

    if (this.selectedFile) {
      formData.append('picture', this.selectedFile, this.selectedFile.name);
    }
    console.log('outside', this.data);
    if (this.isEditMode) {
      console.log(this.data);
      this.announcementService
        .updateAnnouncement(this.data.id, formData)
        .subscribe({
          next: () => {
            this.dialogRef.close(true);
            this.EventBusService.emit('announcement-change');
          },
          error: (err) => console.error('Failed to update announcement', err),
        });
      this.EventBusService.emit('announcement-change');
    } else {
      console.log('this', this.data);
      this.announcementService.createAnnouncement(formData).subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.EventBusService.emit('announcement-change');
        },
        error: (err) => console.error('Failed to create announcement', err),
      });
    }
  }

  private formatDate(date: Date): string {
    const parsedDate = new Date(date);
    return parsedDate.toString();
  }
}
