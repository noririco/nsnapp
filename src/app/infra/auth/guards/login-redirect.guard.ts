import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../../../store/auth.store';

export const loginRedirectGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAuthenticated()) {
    console.log('[loginRedirectGuard] User is authenticated, redirecting to home page');
    // Redirect to a default route if already logged in
    router.navigate(['/home']);
    return false;
  }

  return true;
};
