import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ContractService, Contract } from 'src/app/services/contract/contract.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css']
})
export class ContractsComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  contracts: Contract[] = [];

  constructor(
    private contractService: ContractService, 
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadContracts();
  }

  loadContracts(): void {
    this.contractService.getContracts().subscribe(
      (contracts: Contract[]) => {
        this.contracts = contracts;
      },
      (error) => {
        this.toastr.error(error.statusText, 'Error');
      }
    );
  }

  download(contractId: number): void {
    this.contractService.download(contractId, true).subscribe(
      () => {
        this.toastr.success('Document signed successfully!', 'Success');
      },
      error => {
        this.toastr.error(error.statusText, 'Error');
      }
    );
  }

  upload() {
    const fileInput = this.fileInput?.nativeElement;
    const file: File | undefined = fileInput?.files?.[0];

    if (file) {
      this.contractService.upload(file).subscribe(
        () => {
          this.toastr.success('File uploaded successfully!', 'Success');
          this.loadContracts();
        },
        error => {
          console.error('Error uploading file', error);
          this.toastr.error(error.statusText, 'Error');
        }
      );
    } else {
      this.toastr.error('No file selected', 'Error');
    }
  }

  sign(contractId: number): void {
    this.router.navigate(['/contract', contractId]);
  }

}
