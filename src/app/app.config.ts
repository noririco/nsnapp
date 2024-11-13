import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './infra/auth/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    // This line configures zone-based change detection with event coalescing.
    // Event Coalescing: This feature reduces the frequency of change detection by coalescing (grouping) multiple events together and running change detection only once per group.
    // It’s beneficial for performance, especially in applications with frequent events like scrolls or mouse moves.
    // Setting eventCoalescing: true minimizes unnecessary change detection cycles, leading to better performance.
    provideZoneChangeDetection({ eventCoalescing: true }),
    // This line sets up the Angular router using a predefined set of routes.
    // Instead of defining routes in an NgModule, the provideRouter function allows you to pass your routes directly, making it compatible with Angular’s standalone component model.
    provideRouter(routes),
  ],
};
