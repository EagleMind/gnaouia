import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserRoleGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('access_token');
    if (token) {
      const accountType = this.authService.getAccountTypeFromToken(token);
      const path = route.firstChild?.url[0]?.path || route.url[0]?.path;
      if (
        accountType === 'job_seeker' &&
        ['browse', 'bookmarks'].includes(path)
      ) {
        this.router.navigate(['/']);
        return false;
      }

      if (accountType === 'recruiter' && path === 'UploadCv') {
        this.router.navigate(['/']);
        return false;
      }
    }

    return true;
  }
}
