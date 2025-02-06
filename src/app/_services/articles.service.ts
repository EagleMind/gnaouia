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
  getAllMerchandise(page: number, size: number): Observable<ArticleResponse> {
    return this.http.get<ArticleResponse>(
      `${this.apiUrl}/article/all?page=${page}&size=${size}`
    );
  }

  getMerchandiseById(id: string): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/article/${id}`);
  }

  createMerchandise(Merchandise: FormData): Observable<Article> {
    return this.http.post<Article>(
      `${this.apiUrl}/article/create`,
      Merchandise
    );
  }

  updateMerchandise(id: string, Merchandise: any): Observable<Article> {
    return this.http.put<Article>(
      `${this.apiUrl}/article/edit/${id}`,
      Merchandise
    );
  }

  deleteMerchandise(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/article/${id}`);
  }
}
