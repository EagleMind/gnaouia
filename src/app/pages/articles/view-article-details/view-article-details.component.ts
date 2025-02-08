import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../../_services/articles.service';
import { Article } from '../../../models/articles.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
@Component({
  selector: 'app-view-article-details',
  standalone: true,
  imports: [NgxEditorModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './view-article-details.component.html',
  styleUrls: ['./view-article-details.component.css'],
})
export class ViewArticleDetailsComponent implements OnInit, OnDestroy {
  faArrowAltCircleLeft = faArrowAltCircleLeft;
  article: Article | null = null;
  editor: any;
  form!: FormGroup;
  selectedFile: File | null = null;
  categories: string[] = [
    'Sports',
    'Technology',
    'Health',
    'Education',
    'Entertainment',
  ];

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: [''],
      editorContent: [''],
      category: [''],
      url: [''],
      file: [null],
    });
  }

  ngOnInit(): void {
    // Initialize the editor
    this.editor = new Editor();

    // Initialize the form with an editorContent field
    this.form = this.fb.group({
      title: [''],
      editorContent: [''],
      category: [''],
      url: [''],
      file: [null],
    });

    const articleId = this.route.snapshot.paramMap.get('articleId');
    if (articleId) {
      this.articleService.getArticleById(articleId).subscribe((data) => {
        this.article = data;
        // Set form value with the article's text for editing
        this.form.patchValue({
          title: this.article.title,
          editorContent: this.article.text,
          category: this.article.category,
          url: this.article.url,
        });
      });
    }
  }

  ngOnDestroy(): void {
    // Clean up editor
    if (this.editor) {
      this.editor.destroy();
    }
  }
  goBack(): void {
    console.log('ba3');
    this.router.navigate([`/articles/`]);
  }
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  saveArticle(): void {
    console.log(this.form.value);
    if (this.article) {
      const updatedArticle: Article = {
        ...this.article,
        title: this.form.value.title,
        text: this.form.value.editorContent,
        category: this.form.value.category,
        url: this.form.value.url,
      };

      this.articleService
        .updateArticle(updatedArticle, this.selectedFile)
        .subscribe((updatedArticle) => {
          this.article = updatedArticle;
          // Navigate back to the articles list page
          this.router.navigate(['/articles']);
        });
    }
  }
}
