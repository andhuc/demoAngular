import { Component, OnInit } from '@angular/core';
import { AuthService, UserForm } from 'src/app/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  constructor(private authService: AuthService, private toastr: ToastrService) { }

  user: UserForm = {
    Username: '',
    Password: '',
  };

  login() {

    this.authService.signIn(this.user).subscribe(
      (authToken) => {
        // Handle successful login (e.g., store token in local storage)
        this.toastr.success('Logged in', 'Success');
      },
      (error) => {
        // Handle login error
        this.toastr.error(error.error, 'Error');
      }
    );
  }

}
