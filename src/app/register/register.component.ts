import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { countries } from './countries';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  countries = countries;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      email: '',
      password: '',
      fullName: '',
      country: '',
    });
  }

  onSubmit(): void {
    const roles = ['SUPER_ADMIN']; // Default role
    const signupData = {
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      roles: roles,
    };

    console.log(signupData);

    this.authService.register(signupData).subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
