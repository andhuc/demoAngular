import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Signature } from 'src/app/pages/contract/contract.component';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  addSignatures(contractId: number, signatures: Signature[]): Observable<void> {
    const url = `${this.apiUrl}/api/Contract/sign/${contractId}`;

    // Set the responseType to 'arraybuffer' to handle binary data
    return this.http.post(url, signatures, { responseType: 'arraybuffer' })
      .pipe(
        // Process the response and trigger file download
        map(data => {
          const blob = new Blob([data], { type: 'application/pdf' });

          // Trigger file download
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'signed_contract.pdf';
          link.click();
        }),
        catchError(error => {
          throw error;
        })
      );
  }

  download(contractId: number, isSigned: boolean): Observable<void> {
    const url = `${this.apiUrl}/api/Contract/${contractId}?isSigned=${isSigned}`;

    // Set the responseType to 'arraybuffer' to handle binary data
    return this.http.get(url, { responseType: 'arraybuffer' })
      .pipe(
        // Process the response and trigger file download
        map(data => {
          const blob = new Blob([data], { type: 'application/pdf' });

          // Trigger file download
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'signed_contract.pdf';
          link.click();
        }),
        catchError(error => {
          throw error;
        })
      );
  }

  upload(file: File): Observable<void> {
    const url = `${this.apiUrl}/api/Contract/upload`;

    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(url, formData, { responseType: 'text' })
      .pipe(
        map(() => void 0), // Cast the response to void
        catchError(error => {
          throw error;
        })
      );
  }

  getContracts(): Observable<Contract[]> {
    const contractsUrl = `${this.apiUrl}/api/Contract/get`;

    return this.http.get(contractsUrl).pipe(
      map((response: any) => {
        return response as Contract[];
      }),
      catchError((error) => {
        throw error;
      })
    );
  }

  getSignatures(contractId: number): Observable<Signature[]> {
    const url = `${this.apiUrl}/api/Contract/getSignature/${contractId}`;

    return this.http.get(url).pipe(
      map((response: any) => {
        return response as Signature[];
      }),
      catchError((error) => {
        throw error;
      })
    );
  }

  saveSignatures(contractId: number, signatures: Signature[]): Observable<void> {
    const url = `${this.apiUrl}/api/Contract/save/${contractId}`;

    return this.http.post(url, signatures, { responseType: 'text' }).pipe(
      map(() => void 0), // Cast the response to void
      catchError((error) => {
        throw error;
      })
    );
  }

  deleteContract(contractId: number): Observable<void> {

    const url = `${this.apiUrl}/api/Contract/${contractId}`;
  
    return this.http.delete<void>(url)
      .pipe(
        catchError(error => {
          throw error;
        })
      );
  }

}

export interface Contract {
  id: number;
  title: string;
  path: string;
  createdAt?: Date;
  isSigned: boolean;
}
