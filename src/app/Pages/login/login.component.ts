import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../Core/Services/Auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, NgClass,TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  isLoading:boolean=false;
  errorMsg:string|null=null;
  isSuccess:string='';
  showPassword: boolean = false;

  private readonly authService=inject(AuthService)
  private readonly router=inject(Router)



 loginForm: FormGroup = new FormGroup({
    
    email: new FormControl(null, [
      Validators.required,
      Validators.email
    ]),

    password: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[A-Z]\w{7,}$/) 
    ]),

  }, );

    validationMessages: any = {
 

  email: {
    required: 'Email is required',
    email: 'Please enter a valid email address'
  },

  password: {
    required: 'Password is required',
    pattern: 'Password must start with a capital letter and be at least 8 characters'
  },

 
}; 


 
  
submitForm(): void {
  if (this.loginForm.valid) {
    this.isLoading = true;
    this.authService.sendLoginForm(this.loginForm.value).subscribe({
      next: (res) => {
        console.log(res);
        this.isLoading = false;
        this.isSuccess = res.message;

        // Save Token
        localStorage.setItem('userToken', res.token);

        // Decode Token
        this.authService.saveUserData();

        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 500);
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
        this.errorMsg = err.error.message;

        // ⏱ إخفاء الرسالة بعد 3 ثواني
        setTimeout(() => {
          this.errorMsg = null;
        }, 3000);
      },
    });
  } else {
    this.loginForm.markAllAsTouched();
  }
}

togglePassword(): void {
  this.showPassword = !this.showPassword;
}

}
