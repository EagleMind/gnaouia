import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // Install this package using npm: npm install jwt-decode

interface DecodedToken {
  exp: number; // Expiration time in seconds
}

export const jwtInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  let token: string | null = localStorage.getItem('jwtToken');
  if (token) {
    try {
      const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

      if (decodedToken.exp < currentTime) {
        console.error('Token has expired.');
        // Optionally, clear the token and redirect to login
        localStorage.removeItem('jwtToken');
        return throwError(
          () => new Error('Token expired. Please log in again.')
        );
      }
    } catch (e) {
      console.error('Invalid token:', e);
      return throwError(() => new Error('Invalid token.'));
    }

    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });

    return next(clonedRequest).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            console.error('Unauthorized request:', err);
          } else {
            console.error('HTTP error:', err);
          }
        } else {
          console.error('An error occurred:', err);
        }

        return throwError(() => err);
      })
    );
  } else {
    console.log('No token found.');
    return next(req);
  }
};
