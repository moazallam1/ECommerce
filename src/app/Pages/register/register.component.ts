import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../Core/Services/Auth/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink,NgClass,TranslateModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  isLoading:boolean=false;
  errorMsg:string | null='';
  isSuccess:string='';
  showPassword: boolean = false;
  private readonly authService=inject(AuthService)
  private readonly router=inject(Router)
  
  // private formBuilder=inject(FormBuilder)

// registerForm:FormGroup =this.formBuilder.group({
//   name:[null,[
//       Validators.required,
//       Validators.minLength(3),
//       Validators.maxLength(20)
//     ]]
// })


 registerForm: FormGroup = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20)
    ]),

    email: new FormControl(null, [
      Validators.required,
      Validators.email
    ]),

    password: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[A-Z]\w{7,}$/) // Example: Starts with capital, 6–11 chars
    ]),

    rePassword: new FormControl(null, [
      Validators.required
    ]),

    phone: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^01[0125][0-9]{8}$/) // Egyptian phone format example
    ])
  },{ validators: this.passwordMatch } );

    validationMessages: any = {
        name: {
          required: 'Name is required',
          minlength: 'Name must be at least 3 characters',
          maxlength: 'Name cannot exceed 20 characters'
        },

        email: {
          required: 'Email is required',
          email: 'Please enter a valid email address'
        },

        password: {
          required: 'Password is required',
          pattern: 'Password must start with a capital letter and be at least 8 characters'
        },

        rePassword: {
          required: 'Please confirm your password',
          mismatch: 'Passwords do not match'
        },

        phone: {
          required: 'Phone number is required',
          pattern: 'Please enter a valid Egyptian phone number (e.g. 01012345678)'
        }
}; 


  passwordMatch(form: AbstractControl) {
    const password = form.get('password')?.value;
    const rePassword = form.get('rePassword')?.value;
    return password === rePassword ? null : { mismatch: true };
  }
  
  submitForm():void{
    if (this.registerForm.valid) {
          this.isLoading=true

      this.authService.sendRegisterForm(this.registerForm.value).subscribe({
        next:(res)=>{
          console.log(res)
          this.isLoading=false;
          this.isSuccess=res.message;
          setTimeout(() => {
            this.router.navigate(['/login'])
          }, 1000);

        },
        error:(err)=>{console.log(err);
          this.isLoading=false;
          this.errorMsg= err.error.message || 'Something went wrong';
          setTimeout(() => {
            this.errorMsg=null
          }, 3000);
          

        }
      })

    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
  