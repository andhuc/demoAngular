import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ContractService, Contract } from 'src/app/services/contract/contract.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css']
})
export class ContractsComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  selectedContract: Contract | null = null;
  contracts: Contract[] = [];

  constructor(
    private contractService: ContractService,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.loadContracts();
  }

  loadContracts(): void {
    this.spinner.show();

    this.contractService.getContracts().subscribe(
      (contracts: Contract[]) => {
        this.contracts = contracts;
        this.spinner.hide();
      },
      (error) => {
        this.toastr.error(error.statusText, 'Error');
        this.spinner.hide();
      }
    );
  }

  download(contractId: number): void {
    this.spinner.show();

    this.contractService.download(contractId, true).subscribe(
      () => {
        this.toastr.success('Document signed successfully!', 'Success');
      },
      error => {
        this.toastr.error(error.statusText, 'Error');
      }
    );

    this.spinner.hide();
  }

  upload() {
    const fileInput = this.fileInput?.nativeElement;
    const file: File | undefined = fileInput?.files?.[0];

    if (file) {
      this.spinner.show();

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

      this.spinner.hide();
    } else {
      this.toastr.error('No file selected', 'Error');
    }
  }

  sign(contractId: number): void {
    this.router.navigate(['/contract', contractId]);
  }

  selectContract(contract: Contract): void {
    this.selectedContract = contract;
  }

  deleteContract(): void {
    const contractId = this.selectedContract?.id;

    if (contractId !== undefined) {
      this.contractService.deleteContract(contractId)
        .subscribe(
          () => {
            // Handle success (e.g., refresh the contract list)
            this.toastr.success('Contract deleted successfully');
            this.contracts = this.contracts.filter(contract => contract.id !== contractId);
          },
          error => {
            // Handle error
            this.toastr.error('Error deleting contract', error);
          }
        );
    } else {
      this.toastr.warning('Selected contract is undefined');
    }
  }

}
