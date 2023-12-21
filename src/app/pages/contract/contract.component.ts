import { Component, OnInit } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit {
  pdfSrc: string = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  currentPage = 1;
  totalPages = 0;
  signatures: Signature[] = [];
  selectedSignature: Signature | null = null;

  constructor() { }

  ngOnInit(): void {
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      let reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        let pdfData: any = reader.result;

        this.pdfSrc = pdfData;
      };
    }
  }

  afterLoadComplete(pdf: any): void {
    this.totalPages = pdf.numPages;
    console.log(document.getElementById('pdf'));
    this.loadSignature();
  }

  goToPrevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  removeSignature(index: number) {
    this.signatures.splice(index, 1);
  }

  onTextLayerRendered(event: any) {
    console.log('Text layer rendered:', event);
  }

  addSignature() {
    const newSignature = {
      page: this.currentPage,
      x: 0,
      y: 0,
      width: 50,
      height: 20,
    };

    this.signatures.push(newSignature);
    console.log('Signature added:', newSignature);
  }

  loadSignature() {
    const pdfElement = document.querySelector('#pdf');
    const signatureContainer = document.querySelector('.signature-container');

    if (pdfElement && signatureContainer) {
      pdfElement.appendChild(signatureContainer);
      console.log('ok')
    } else console.log(pdfElement, signatureContainer)

    setTimeout(() => {
      const referenceElement = document.querySelector('.page') as HTMLElement | null;
      const targetElement = document.querySelector('.signature-page') as HTMLElement | null;

      // Check if both elements exist
      if (referenceElement && targetElement) {
        console.log('ok2');

        // Get the dimensions of the reference element
        const { width, height } = referenceElement.getBoundingClientRect();

        // Apply the dimensions to the target element
        targetElement.style.width = `${width}px`;
        targetElement.style.height = `${height}px`;
      }
    }, 1000);
  }
}

export interface Signature {
  page: number,
  x: number,
  y: number,
  width: number,
  height: number,
}
