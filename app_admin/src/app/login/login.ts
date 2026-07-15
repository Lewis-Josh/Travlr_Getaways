import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../services/authentication';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  public formError: string = '';
  public submitted: boolean = false;

  public credentials = {
    name: '',
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private changeDetector: ChangeDetectorRef
  ) { }

  public onLoginSubmit(): void {
    this.submitted = true;
    this.formError = '';

    if (!this.credentials.email || !this.credentials.password) {
      this.formError = 'Email and password are required. Please try again.';
      this.changeDetector.detectChanges();
      return;
    }

    this.doLogin();
  }

  private doLogin(): void {
    const loginUser = {
      name: this.credentials.name,
      email: this.credentials.email
    } as User;

    this.authenticationService.login(loginUser, this.credentials.password)
      .subscribe({
        next: () => {
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '';
          const safeReturnUrl = returnUrl.startsWith('/') ? returnUrl : '';

          window.location.assign(safeReturnUrl || '/');
        },
        error: (error: any) => {
          console.log('Login error response:', error);

          if (error?.error?.message) {
            this.formError = error.error.message;
          } else if (typeof error?.error === 'string') {
            this.formError = error.error;
          } else {
            this.formError = 'Login failed. Please check your email and password.';
          }

          this.changeDetector.detectChanges();
        }
      });
  }
}