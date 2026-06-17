import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false
})
export class RegisterComponent {
userEmail: string = 'nom@Openclassrooms';
userName: string = '';
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  registerForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit(): void {

    if (this.registerForm.invalid) {
      return;
    }

    const user = {
      username: this.registerForm.value.username ?? '',
      email: this.registerForm.value.email ?? '',
      password: this.registerForm.value.password ?? ''
    };

    this.authService
      .register(user)
      .subscribe({

        next: (message) => {

          console.log('Inscription réussie :', message);

          this.router.navigate(['/articleform']);
        },

        error: (error) => {

          console.error('Erreur complète :', error);

          alert(
            `Erreur lors de la création

        Status : ${error.status}
        Message : ${error.message}
        URL : ${error.url}
        Réponse : ${error.error}`
          );
        }

      });

  }
}
