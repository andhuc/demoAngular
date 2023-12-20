import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit {
  pdfSrc: string = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  currentPage = 1;
  totalPages = 0;

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
    // Access the PDF information and set the viewer height accordingly
    // const aspectRatio = pdf.numPages / pdf.numPages;
    // const viewer = document.querySelector('pdf-viewer') as HTMLElement;
    // const viewerWidth = viewer.offsetWidth;
    // const viewerHeight = viewerWidth * aspectRatio;
    // viewer.style.height = viewerHeight + 'px';

    this.totalPages = pdf.numPages;
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

}
