import { Component, OnInit } from '@angular/core';
import { AuthService, UserForm } from 'src/app/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  constructor(private authService: AuthService, private toastr: ToastrService, private router: Router) { }

  user: UserForm = {
    Username: '',
    Password: '',
  };

  login() {

    this.authService.signIn(this.user).subscribe(
      (authToken) => {
        this.toastr.success('Logged in', 'Success');
        // if (this.authService.hasRole(1))
        //   this.router.navigate(['/admin/dashboard']);
        // else this.router.navigate(['/home']);
      },
      (error) => {
        this.toastr.error(error.error, 'Error');
      }
    );
  }

}