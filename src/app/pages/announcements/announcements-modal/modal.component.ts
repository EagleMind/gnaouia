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
import moment from 'moment';
import { DateAdapter } from '@angular/material/core';
import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
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
import { AnnouncementService } from '../../../_services/announcements';

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
    providers: [
        provideNativeDateAdapter(),
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnouncementDialogComponent implements OnInit {
  faPlus = faPlus;
  faCheck = faCheck;
  selectedFile: File | null = null;
  form: FormGroup;
  isEditMode: boolean = false;
  isDeleteMode: boolean = false;

  constructor(
    private dateAdapter: DateAdapter<Date>,
    private eventBusService: EventBusService,
    private announcementService: AnnouncementService,
    public dialogRef: MatDialogRef<AnnouncementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dateAdapter.setLocale('en-GB');
    this.form = new FormGroup({
      name: new FormControl(data?.name || '', [Validators.required]),
      url: new FormControl(data?.url || '', [Validators.required]),
      dateFrom: new FormControl(data?.dateFrom || null),
      dateTo: new FormControl(data?.dateTo || null),
      pictureUrl: new FormControl(data?.pictureUrl || null),
    });
    this.isEditMode = !!data?.id; // Set edit mode if ID exists
    this.isDeleteMode = data?.isDelete; // Check if it's for deletion
  }

  ngOnInit(): void {
    console.log(this.data);
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
    if (this.isDeleteMode) {
      this.deleteAnnouncement();
    } else {
      this.isEditMode ? this.updateAnnouncement() : this.createAnnouncement();
    }
  }

  private createAnnouncement(): void {
    const formData = this.prepareFormData();
    this.announcementService.createAnnouncement(formData).subscribe({
      next: () => {
        this.dialogRef.close(true);
        this.eventBusService.emit('announcement-change');
      },
      error: (err) => console.error('Failed to create announcement', err),
    });
  }

  private updateAnnouncement(): void {
    const formData = this.prepareFormData();
    console.log('FORM DATA', formData);
    this.announcementService
      .updateAnnouncement(this.data.id, formData)
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.eventBusService.emit('announcement-change');
        },
        error: (err) => console.error('Failed to update announcement', err),
      });
  }

  private deleteAnnouncement(): void {
    this.announcementService.deleteAnnouncement(this.data.id).subscribe({
      next: () => {
        this.dialogRef.close(true);
        this.eventBusService.emit('announcement-change');
      },
      error: (err) => console.error('Failed to delete announcement', err),
    });
  }

  private prepareFormData(): FormData {
    const formData = new FormData();
    console.log('FORM', moment(this.form.value.dateFrom).format('L'));
    formData.append('name', this.form.value.name);
    formData.append('url', this.form.value.url);
    formData.append('dateFrom', this.formatDate(this.form.value.dateFrom));
    formData.append('dateTo', this.formatDate(this.form.value.dateTo));
    if (this.selectedFile) {
      formData.append('picture', this.selectedFile, this.selectedFile.name);
    }

    return formData;
  }

  private formatDate(date: string): string {
    return date ? moment(this.form.value.dateFrom).format('L') : '';
  }
}
