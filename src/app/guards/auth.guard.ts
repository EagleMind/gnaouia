import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.authService.isLoggedIn.subscribe((result) => {
        if (result) {
          console.log(
            'this.authService.isLoggedIn',
            this.authService.isLoggedIn
          );
          resolve(true);
        } else {
          this.router.navigate(['/login']);
          resolve(false);
        }
      });
    });
  }
}
