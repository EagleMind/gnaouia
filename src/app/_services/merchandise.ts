import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Merchandise, MerchandiseResponse } from '../models/merchandise.model';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MerchandiseService {
  private apiUrl = environment.apiUrl; // Adjust the URL accordingly

  constructor(private http: HttpClient) {}
  getAllMerchandise(
    page: number,
    size: number
  ): Observable<MerchandiseResponse> {
    return this.http.get<MerchandiseResponse>(
      `${this.apiUrl}/merchandise/all?page=${page}&size=${size}`
    );
  }

  getMerchandiseById(id: string): Observable<Merchandise> {
    return this.http.get<Merchandise>(`${this.apiUrl}/merchandise/${id}`);
  }

  createMerchandise(Merchandise: FormData): Observable<Merchandise> {
    return this.http.post<Merchandise>(
      `${this.apiUrl}/merchandise/create`,
      Merchandise
    );
  }

  updateMerchandise(id: string, Merchandise: any): Observable<Merchandise> {
    return this.http.put<Merchandise>(
      `${this.apiUrl}/merchandise/edit/${id}`,
      Merchandise
    );
  }

  deleteMerchandise(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/merchandise/${id}`);
  }
}
