import { Component, OnInit } from '@angular/core';
import { AuthService, UserForm } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  constructor(private authService: AuthService) { }

  user: UserForm = {
    Username: '',
    Password: '',
  };

  login() {

    this.authService.signIn(this.user).subscribe(
      (authToken) => {
        // Handle successful login (e.g., store token in local storage)
        console.log('Login successful', authToken);
      },
      (error) => {
        // Handle login error
        console.error('Login error', error);
      }
    );
  }

}
