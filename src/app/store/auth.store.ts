import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { setError, setFulfilled, setPending, withRequestStatus } from './utils/request-status.feature';
import { BASE_API_URL } from '../infra/utils/constants';

/**
 * NOTE: Session Storage vs Local Storage
 * sessionStorage limits session persistence to a single tab or window, meaning if the user closes the tab, they’re logged out.
 * While this might be a security advantage, it can hinder user experience for multi-tab applications.
 * localStorage persists across tabs and windows, but data remains available until manually cleared by the user or app,
 * which may cause unwanted persistence for sensitive data.
 */

export type AuthState = {
  isAuthenticated: boolean;
  role: 'Admin' | 'User' | null;
  token: string | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  role: null,
  token: null,
};

/**
 * Auth Store is a signal store that manages authentication state.
 *
 * checkAuthentication: method that checks if the user is authenticated in localStorage.
 * The store is initialized with the checkAuthentication method, which checks if the user is authenticated in localStorage.
 * If the user is authenticated, the store is updated with the user's role and token.
 *
 * login: sends a POST request to the /api/auth/login endpoint with the provided credentials.
 * If the login is successful, the store is updated with the user's role and token, and the user is navigated to the home page.
 *
 * logout: sends a POST request to the /api/auth/logout endpoint, which clears the user's authentication state.
 * If the logout is successful, the store is updated with the user's role and token, and the user is navigated to the login page.
 */
export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withRequestStatus(),
  withMethods((store) => {
    const http = inject(HttpClient);
    const router = inject(Router);

    return {
      async login(credentials: { username: string; password: string }) {
        try {
          console.log('[AuthStore] login');
          patchState(store, setPending());
          // Mock 3 second delay to see loading state
          await new Promise((resolve) => setTimeout(resolve, 3000));
          const { role, token } = await firstValueFrom(http.post<{ token: string; role: 'Admin' | 'User' }>(`${BASE_API_URL}/auth/login`, credentials));

          if (token) {
            patchState(store, { isAuthenticated: true, role, token });
            localStorage.setItem('SESSION_T', JSON.stringify({ isAuthenticated: true, role, token }));
            router.navigate(['home']);
            patchState(store, setFulfilled());
          }
        } catch (error) {
          patchState(store, setError('Login failed'));
          console.error('[AuthStore] Login failed', error);
        }
      },
      /**
       * Logout from the server and clear the localStorage
       * @param shallow { shallow: boolean } - if true will not send a logout request to the server
       */
      async logout({ shallow }: { shallow: boolean }) {
        console.log('[AuthStore] logout');
        if (!shallow) {
          await firstValueFrom(http.post<{}>(`${BASE_API_URL}/auth/logout`, {}));
        }

        localStorage.removeItem('SESSION_T');
        patchState(store, { isAuthenticated: false, role: null, token: null });
        router.navigate(['login']);
      },
      checkAuthentication() {
        console.log('[AuthStore] checkAuthentication');
        const { isAuthenticated, role, token } = JSON.parse(localStorage.getItem('SESSION_T') || '{}');
        if (isAuthenticated) {
          patchState(store, { isAuthenticated, role, token });
        }
      },
    };
  }),
  withHooks({
    onInit(store) {
      console.log('[AuthStore] onInit');
      // Check if the user is authenticated in localStorage
      store.checkAuthentication();
    },
  })
);
