import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  onSubmit(): void {
    console.log('Email :', this.email);
    console.log('Password :', this.password);
  }

}
