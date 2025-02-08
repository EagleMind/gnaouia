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
import { ArticleService } from '../../../_services/articles.service';

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
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleDialogComponent {
  faPlus = faPlus;
  faCheck = faCheck;
  selectedFile: File | null = null;
  form: FormGroup;
  isEditMode: boolean = false;
  isDeleteMode: boolean = false;

  constructor(
    private dateAdapter: DateAdapter<Date>,
    private eventBusService: EventBusService,
    public dialogRef: MatDialogRef<ArticleDialogComponent>,
    private articleService: ArticleService,
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

  onCancel(): void {
    this.dialogRef.close();
  }

  onDelete(): void {
    this.articleService
      .deleteArticle(this.data.id)
      .subscribe((response: any) => {
        if (response) {
          this.eventBusService.emit('article-change');
        }
        this.dialogRef.close();
      });
  }
}
