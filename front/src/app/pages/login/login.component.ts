import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent {

  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit(): void {

    if (this.loginForm.invalid) {
      return;
    }

    const email =
      this.loginForm.value.email ?? '';

    const password =
      this.loginForm.value.password ?? '';

    const user =
      this.userService.login(
        email,
        password
      );

    if (user) {

      alert(
        `Bienvenue ${user.username}`
      );

    } else {

      this.errorMessage =
        'Email ou mot de passe incorrect';

    }
  }
}
