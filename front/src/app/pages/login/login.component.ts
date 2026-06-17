import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent {

  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit(): void {

    if (this.loginForm.invalid) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    const email =
      this.loginForm.value.email ?? '';

    const password =
      this.loginForm.value.password ?? '';

    this.authService
      .login(email, password)
      .subscribe({
        next: (response: string) => {

          console.log(response);

          this.successMessage = response;

        },
        error: (error) => {

          console.error(error);

          this.errorMessage =
            'Email ou mot de passe incorrect';

        }
      });
  }
}
