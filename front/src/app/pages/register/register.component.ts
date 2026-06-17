import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";


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
    private authService: AuthService
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
      username:
        this.registerForm.value.username ?? '',

      email:
        this.registerForm.value.email ?? '',

      password:
        this.registerForm.value.password ?? ''
    };

    this.authService
      .register(user)
      .subscribe({

        next: (message) => {

          alert(message);

          console.log(
            'Utilisateur créé'
          );
        },

        error: (error) => {

          console.error(error);

          alert(
            'Erreur lors de la création'
          );
        },

      });
  }
}
