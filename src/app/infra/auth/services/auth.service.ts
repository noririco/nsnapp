import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  constructor() {}

  isAuthenticated(): boolean {
    return false;
  }

  async login({ name, password }: { name: string; password: string }) {
    try {
      await firstValueFrom(
        this.http.post<any>('http://localhost:3000/login', { name, password })
      );

      // fake call to check if user is authenticated with Promise and 3 sec delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      this.router.navigate(['home']);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  logout() {
    this.router.navigate(['login']);
  }
}
