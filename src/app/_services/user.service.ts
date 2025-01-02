import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = process.env['API_URL']; // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/auth/profile');
  }

  updateUserProfile(profileData: any): Observable<any> {
    return this.http.put<any>(
      this.apiUrl + '/auth/profile/update',
      profileData
    );
  }
}
