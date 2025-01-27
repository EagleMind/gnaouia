import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../../_services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    this.authService.LoggedIn().subscribe((loggedIn: any) => {
      if (loggedIn && state.url === '/login') {
        // If user is logged in and trying to access the login route, redirect to the home or profile page
        this.router.navigate(['/']);
        console.log('d', loggedIn);
      }
    });

    // If user is not logged in, allow access to the route
    return true;
  }
}
