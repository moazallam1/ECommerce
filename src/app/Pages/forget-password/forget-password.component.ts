import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../Core/Services/Auth/auth.service';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule,NgClass,TranslateModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss',
})
export class ForgetPasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  step: number = 1;

  isLoading: boolean = false;
  errorMsg: string |null= '';
  isSuccess: string = '';
  showPassword: boolean = false;


  // Step 1: Verify Email
  verifyEmail: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
  });

  // Step 2: Verify Code
  verifyCode: FormGroup = new FormGroup({
    resetCode: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[0-9]{6}$/),
    ]),
  });

  // Step 3: Reset Password
  resetPassword: FormGroup = new FormGroup({
    newPassword: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[A-Z]\w{7,}$/),
    ]),
  });

  // Step 1
  submitVerifyEmail(): void {
    if (this.verifyEmail.invalid) {
      this.verifyEmail.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMsg = '';
    this.isSuccess = '';

    this.authService.verifyEmail(this.verifyEmail.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.statusMsg === 'success') {
          this.isSuccess = res.message || 'Verification code sent!';
          this.step = 2;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = err.error.message || 'Something went wrong';

        setTimeout(() => {
           this.errorMsg=null
        }, 3000);
      },
    });
  }

  // Step 2
  submitVerifyCode(): void {
    if (this.verifyCode.invalid) {
      this.verifyCode.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMsg = '';
    this.isSuccess = '';

    this.authService.verifyResetCode(this.verifyCode.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.statusMsg !== 'fail') {
          this.isSuccess = res.message || 'Code verified successfully!';
          this.step = 3;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = err.error.message || 'Invalid verification code';
        setTimeout(() => {
          this.errorMsg=null
        }, 3000);
      },
    });
  }

  // Step 3
  submitVerifyPassword(): void {
    if (this.resetPassword.invalid) {
      this.resetPassword.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMsg = '';
    this.isSuccess = '';

    this.authService.verifyResetPassword(this.resetPassword.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.isSuccess = res.message || 'Password reset successfully!';
        localStorage.setItem('userToken', res.token);
        this.authService.saveUserData();
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1200);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = err.error.message || 'Something went wrong';

        setTimeout(() => {
          this.errorMsg=null
        }, 3000);
      },
    });
  }


togglePassword() {
  this.showPassword = !this.showPassword;
}

}
