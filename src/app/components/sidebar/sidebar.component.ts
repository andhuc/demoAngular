import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  sidebarData = [
    {name: 'Home', link: '/admin/home'},
    {name: 'Products', link: '/admin/products'},
    {name: 'Logout', link: '/logout'},
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
