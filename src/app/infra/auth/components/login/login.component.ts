import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AppStore } from '../../../../store/app.store';
import { AuthStore } from '../../../../store/auth.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  authService = inject(AuthService);
  loginForm: FormGroup;
  errorMessage: string = '';

  appStore = inject(AppStore);
  authStore = inject(AuthStore);

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  changeVersion() {
    this.appStore.changeVersion('0.0.2');
  }

  async onSubmit(): Promise<void> {
    if (!this.loginForm.valid) {
      this.errorMessage = 'Please enter valid email and password.';
    }

    try {
      // await this.authService.login(this.loginForm.value);
      await this.authStore.login(this.loginForm.value);
    } catch (error) {
      console.error(error);
      this.errorMessage = 'Login Failed!';
    }
  }
}
