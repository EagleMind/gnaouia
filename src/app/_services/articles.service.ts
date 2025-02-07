import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Merchandise, MerchandiseResponse } from '../models/merchandise.model';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Article, ArticleResponse } from '../models/articles.model';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private apiUrl = environment.apiUrl; // Adjust the URL accordingly

  constructor(private http: HttpClient) {}
  getAllArticles(page: number, size: number): Observable<ArticleResponse> {
    return this.http.get<ArticleResponse>(
      `${this.apiUrl}/article?page=${page}&size=${size}`
    );
  }

  getArticleById(id: string): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/article/${id}`);
  }

  createArticle(Merchandise: FormData): Observable<Article> {
    return this.http.post<Article>(
      `${this.apiUrl}/article/create`,
      Merchandise
    );
  }

  updateArticle(article: Article, file: File | null): Observable<Article> {
    const formData = new FormData();
    formData.append('id', article.id);
    formData.append('title', article.title);
    formData.append('text', article.text);
    formData.append('category', article.category);
    formData.append('url', article.url);
    if (file) {
      formData.append('file', file, file.name);
    }

    return this.http.put<Article>(`${this.apiUrl}/article/save`, formData);
  }

  deleteArticle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/article/${id}`);
  }
}
