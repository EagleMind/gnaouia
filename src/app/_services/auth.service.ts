import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  public isLoggedIn = new BehaviorSubject<boolean>(this.hasTokenAndValid());

  constructor(private http: HttpClient, private router: Router) {}

  private hasTokenAndValid(): boolean {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const expiry = JSON.parse(atob(token.split('.')[1])).exp;
      return Math.floor(new Date().getTime() / 1000) <= expiry;
    }
    return !!token;
  }

  login(email: string, password: string): Observable<any> {
    if (!this.hasTokenAndValid()) {
      localStorage.removeItem('JwtToken');
    }
    return this.http
      .post<any>(`${this.apiUrl}/auth/signin`, { email, password })
      .pipe(
        tap((response) => {
          if (response && response.jwtToken) {
            localStorage.setItem('jwtToken', response.jwtToken);
            this.isLoggedIn.next(true);
          }
        })
      );
  }

  register(payload: { email: string; password: string }): Observable<any> {
    const roles = ['SUPER_ADMIN', 'CUSTOMER'];

    return this.http
      .post<any>(`${this.apiUrl}/auth/signup`, {
        payload,
      })
      .pipe(
        tap((response) => {
          if (response && response.jwtToken) {
            localStorage.setItem('jwtToken', response.jwtToken);
            this.isLoggedIn.next(true);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('jwtToken');
    this.isLoggedIn.next(false);
    this.router.navigate(['/login']); // Redirect to login or another page on logout
  }

  LoggedIn(): Observable<boolean> {
    return this.isLoggedIn.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  getUserIdFromToken(token: string): string {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user._id;
  }
}
