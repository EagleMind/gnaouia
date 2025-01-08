import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptorInterceptor } from '../../jwt-interceptor.interceptor';
import {provideAnimations} from "@angular/platform-browser/animations";
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideHttpClient(withInterceptors([jwtInterceptorInterceptor])),
  ],
};
