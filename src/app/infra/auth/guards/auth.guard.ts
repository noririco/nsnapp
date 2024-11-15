import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../../../store/auth.store';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authStore = inject(AuthStore);

  if (authStore.isAuthenticated()) {
    console.log('[authGuard] User is authenticated');
    return true;
  }

  console.warn(`[authGuard] User not authenticated to see ${router.getCurrentNavigation()?.finalUrl}, navigating to login page.`);
  router.navigate(['/login']);
  return false;
};
