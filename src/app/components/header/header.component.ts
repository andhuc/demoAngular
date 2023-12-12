import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLogined: boolean = this.authService.getAuthToken() != null;

  constructor(private authService: AuthService) { }

  async ngOnInit(): Promise<void> {
    this.isLogined = await this.authService.checkLogined();
  }

  logout(): void {
    this.authService.clearAuthToken();
  }

}
