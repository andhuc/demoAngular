import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  sidebarData = [
    {name: 'Dashboard', link: '/admin/dashboard'},
    {name: 'Products', link: '/admin/products'},
    {name: 'Users', link: '/admin/users'},
    {name: 'Contracts', link: '/admin/contracts'},
  ];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.authService.clearAuthToken();
  }

}
