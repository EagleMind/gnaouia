import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Announcement,
  AnnouncementsResponse,
} from '../models/announcements.model';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementService {
  private apiUrl = environment.apiUrl; // Adjust the URL accordingly

  constructor(private http: HttpClient) {}
  getAllAnnouncements(
    page: number,
    size: number
  ): Observable<AnnouncementsResponse> {
    return this.http.get<AnnouncementsResponse>(
      `${this.apiUrl}/announcements/all?page=${page}&size=${size}`
    );
  }

  getAnnouncementById(id: string): Observable<Announcement> {
    return this.http.get<Announcement>(`${this.apiUrl}/announcements/${id}`);
  }

  createAnnouncement(announcement: FormData): Observable<Announcement> {
    return this.http.post<Announcement>(
      `${this.apiUrl}/announcements/create`,
      announcement
    );
  }

  updateAnnouncement(id: string, announcement: any): Observable<Announcement> {
    return this.http.put<Announcement>(
      `${this.apiUrl}/announcements/edit/${id}`,
      announcement
    );
  }

  deleteAnnouncement(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/announcements/${id}`);
  }
}
