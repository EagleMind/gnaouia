import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { Announcement } from '../../../../models/announcements.model';
import { AnnouncementService } from '../../../../_services/announcements';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CommonModule} from "@angular/common";

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
  ],
  providers: [provideNativeDateAdapter()],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnouncementDialogComponent implements OnInit {
  selectedFile: File | null = null; // Store the selected file

  constructor(
    private announcementService: AnnouncementService,
    public dialogRef: MatDialogRef<AnnouncementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Announcement
  ) {}

  ngOnInit(): void {}

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0]; // Store the selected file
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.data.pictureUrl = e.target.result; // Assign image data URL to imageUrl
      };

      reader.readAsDataURL(this.selectedFile);
    }
  }

  onDateFromChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.data.dateFrom = new Date(input.value);
    console.log('Selected Date From:', this.data.dateFrom);
  }

  onDateToChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.data.dateTo = new Date(input.value);
    console.log('Selected Date To:', this.data.dateTo);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const formData = new FormData();

    // Append form fields to FormData
    formData.append('name', this.data.name);
    formData.append('url', this.data.url);
    // Convert dateFrom and dateTo to ISO strings (or any required string format)
    formData.append(
      'dateFrom',
      this.data.dateFrom.toISOString().split('T')[0].replace(/-/g, '/')
    );
    formData.append(
      'dateTo',
      this.data.dateTo.toISOString().split('T')[0].replace(/-/g, '/')
    );

    // Append the picture file if it exists
    if (this.selectedFile) {
      formData.append('picture', this.selectedFile, this.selectedFile.name);
    }
    this.announcementService
      .updateAnnouncement(this.data.id, formData)
      .subscribe({
        next: () => {
          this.dialogRef.close();
        },
      });
  }
}
