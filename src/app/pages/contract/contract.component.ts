import { ContractService } from './../../services/contract/contract.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit {
  contractId = 0;
  pdfSrc: string = '';
  currentPage = 1;
  totalPages = 0;
  signatures: Signature[] = [];
  selectedSignature: Signature = {
    page: 0,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    name: '',
    reason: '',
    imageData: null
  };

  initWidth = 250;
  initHeight = 75;

  constructor(
    private contractService: ContractService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(async params => {
      this.spinner.show();

      this.contractId = +params['contractId'];
      this.pdfSrc = `http://localhost:5000/api/Contract/${this.contractId}`;
      this.currentPage = this.storageService.getNumberValue(this.pdfSrc)?? 1;

      await this.loadSignatures();
    });
  }

  setInitialTransformations(): void {

    this.signatures.forEach((signature, index) => {
      const elementId = index + '';
      const x = signature.x;
      const y = this.getPageHeight() - signature.y - signature.height;

      this.setTransform(elementId, x, y);
    });
  }

  setTransform(elementId: string, x: number, y: number): void {
    const element = document.getElementById(elementId);

    if (element) {
      element.style.transform = `translate(${x}px, ${y}px)`;
    } else {
      console.error(`Element with ID "${elementId}" not found.`);
    }
  }

  afterLoadComplete(pdf: any): void {
    this.totalPages = pdf.numPages;

    setTimeout(async () => {
      this.fixSize();
      this.setInitialTransformations();
      this.spinner.hide();
    }, 500);
  }

  fixSize(): void {
    this.setHeight('.ng2-pdf-viewer-container', '.pdfViewer');
    this.setHeight('#pdf', '.pdfViewer');

    this.setWidth('.signature-page', '.page')

    const page = document.querySelector('.page') as HTMLElement;
    page && (page.style.marginBottom = '0px');
  }

  setHeight(selector1: string, selector2: string): void {
    const element1 = document.querySelector(selector1) as HTMLElement;
    const element2 = document.querySelector(selector2) as HTMLElement;

    if (element1 && element2) {
      const height = element2.clientHeight;
      element1.style.height = `${height}px`;
    } else {
      console.error('One or both elements not found');
    }
  }

  setWidth(selector1: string, selector2: string): void {
    const element1 = document.querySelector(selector1) as HTMLElement;
    const element2 = document.querySelector(selector2) as HTMLElement;

    if (element1 && element2) {
      const width = element2.clientWidth;
      element1.style.width = `${width}px`;
    } else {
      console.error('One or both elements not found');
    }
  }

  goToPrevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
    this.fixSize();
    this.storageService.saveKeyValuePair(this.pdfSrc, this.currentPage);
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
    this.fixSize();
    this.storageService.saveKeyValuePair(this.pdfSrc, this.currentPage);
  }

  removeSignature(index: number) {
    this.signatures.splice(index, 1);
  }

  addSignature() {
    const newSignature = {
      page: this.currentPage,
      x: 0,
      y: this.getPageHeight(),
      width: this.initWidth,
      height: this.initHeight,
      name: 'tester',
      reason: 'test',
      imageData: null
    };

    this.signatures.push(newSignature);
  }

  onDragMoved(index: number): void {
    let coor: any = this.getTranslateValues(index + '');

    this.signatures[index].x = coor.x;
    this.signatures[index].y = this.getPageHeight() - coor.y - this.signatures[index].height;
  }

  getPageHeight(): number {
    let signaturePageElement = document.querySelector('.signature-page');
    let pageHeight = signaturePageElement ? parseFloat(getComputedStyle(signaturePageElement).height) : null;

    return pageHeight ?? 0;
  }

  getTranslateValues(elementId: string) {
    const element = document.getElementById(elementId);

    if (element) {
      const transformValue = window.getComputedStyle(element).getPropertyValue('transform');

      if (transformValue.includes('matrix')) {
        // Extract the matrix values
        const matrixMatch = transformValue.match(/matrix\(([^\)]+)\)/);

        if (matrixMatch && matrixMatch[1]) {
          const matrixValues = matrixMatch[1].split(', ');
          const translateX = parseFloat(matrixValues[4]);
          const translateY = parseFloat(matrixValues[5]);

          return { x: translateX, y: translateY };
        }
      } else if (transformValue.includes('translate3d')) {
        // Extract the translate3d values
        const regex = /translate3d\(([-\d\.]+)px, ([-\d\.]+)px, ([-\d\.]+)px\)/;
        const matches = transformValue.match(regex);

        if (matches) {
          const [_, translateX, translateY] = matches.map(parseFloat);
          return { x: translateX, y: translateY };
        }
      }

      console.error("Invalid transform value:", transformValue);
      return { x: 0, y: 0 }; // or handle the error as needed
    } else {
      console.error('Element not found');
      return { x: 0, y: 0 }; // or handle the error as needed
    }
  }

  resizeSignature(index: number): void {
    let elementId = `resizeHandle${index}`;
    let coor: any = this.getTranslateValues(elementId);

    this.signatures[index].width = this.initWidth + coor.x;
    this.signatures[index].height = this.initHeight + coor.y;

    this.clearTransform(elementId);
  }

  clearTransform(elementId: string): void {
    const element = document.getElementById(elementId);

    if (element) {
      element.style.transform = '';
    } else {
      console.error(`Element with ID "${elementId}" not found.`);
    }
  }

  sign() {
    if (this.signatures.length == 0) {
      this.toastr.warning('Signature required!', 'Warning');
      return;
    }

    this.spinner.show();

    // Make a call to your backend service to add signatures
    this.contractService.addSignatures(this.contractId, this.signatures).subscribe(
      () => {
        this.toastr.success('Document signed successfully!', 'Success');
      },
      error => {
        this.toastr.error(error.error?? error.statusText, 'Error');
        console.log(error)
      }
    );

    this.spinner.hide();
  }

  selectSignature(index: number): void {
    this.selectedSignature = this.signatures[index];
  }

  async loadSignatures(): Promise<void> {
    // Make a call to your backend service to get signatures
    try {
      const signatures = await this.contractService.getSignatures(this.contractId).toPromise();
      this.signatures = signatures ?? [];
    } catch (error: any) {
      console.error(error);
    }
  }

  saveSignatures(): void {
    if (this.signatures.length == 0) {
      this.toastr.warning('Signature required!', 'Warning');
      return;
    }

    this.spinner.show();

    // Make a call to your backend service to save signatures
    this.contractService.saveSignatures(this.contractId, this.signatures).subscribe(
      () => {
        this.toastr.success('Signatures saved successfully!', 'Success');
      },
      error => {
        this.toastr.error(error.statusText, 'Error');
      }
    );

    this.spinner.hide();
  }

  async changeImage(event: any) {
    const file = event.target.files[0];

    if (file) {
      await this.convertFileToBase64(file).then(base64String => {
        this.selectedSignature.imageData = base64String;
        console.log(base64String)
      });
    }

    event.target.value = '';
  }

  async convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.toastr.error('Invalid file type. Please select an image.', 'Error');
        reject(new Error('Invalid file type. Please select an image.'));
        return;
      }

      // Validate file size (for example, limit to 5 MB)
      const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
      if (file.size > maxSizeInBytes) {
        this.toastr.error('File size exceeds the allowed limit (5 MB).', 'Error');
        reject(new Error('File size exceeds the allowed limit (5 MB).'));
        return;
      }

      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const base64Content = reader.result.split(',')[1];
          resolve(base64Content);
        } else {
          this.toastr.error('Failed to read file.', 'Error');
          reject(new Error('Failed to read file.'));
        }
      };

      reader.onerror = (error) => {
        this.toastr.error(error.toString(), 'Error');
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }

  clearImage() :void{
    this.selectedSignature.imageData = null;
  }

}

export interface Signature {
  page: number,
  x: number,
  y: number,
  width: number,
  height: number,
  name: string,
  reason: string,
  imageData: string | null
}
