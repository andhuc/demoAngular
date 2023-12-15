import { Component, OnInit } from '@angular/core';
import { SystemService, SystemHistory } from 'src/app/services/system/system.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  systemHistory: SystemHistory[] = [];
  selectedSystemHistory: SystemHistory | null = null;

  constructor(
    private systemService: SystemService, 
    private toastr: ToastrService) {}

  ngOnInit(): void {
    this.getSystemHistory();
  }

  getSystemHistory(): void {
    this.systemService.getSystemHistory().subscribe(
      (data) => {
        this.systemHistory = data;
      },
      (error) => {
        console.error('Error fetching system history:', error);
        this.toastr.error('Error fetching system history', 'Error');
      }
    );
  }

  openModal(systemHistory: SystemHistory): void {
    this.selectedSystemHistory = systemHistory;
  }

}
