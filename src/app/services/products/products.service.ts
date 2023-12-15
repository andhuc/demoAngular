import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getProductsList(page: number): Observable<Product[]> {
    const productsUrl = `${this.apiUrl}/api/Products/get?page=${page}`;

    // Set headers if needed (e.g., content type)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get(productsUrl, { headers }).pipe(
      map((response: any) => {
        // Assuming your API returns an array of Product objects
        return response as Product[];
      }),
      catchError((error) => {
        // Handle error appropriately, e.g., log or throw a custom exception
        throw error;
      })
    );
  }

  filterProductsList(page: number, productName?: string | null, categoryId?: number | null): Observable<Product[]> {
    const filterUrl = `${this.apiUrl}/api/Products/filter?page=${page}` +
                      `${productName ? `&productName=${productName}` : ''}` +
                      `${categoryId ? `&categoryId=${categoryId}` : ''}`;

    // Set headers if needed (e.g., content type)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get(filterUrl, { headers }).pipe(
      map((response: any) => {
        // Assuming your API returns an array of Product objects
        return response as Product[];
      }),
      catchError((error) => {
        // Handle error appropriately, e.g., log or throw a custom exception
        throw error;
      })
    );
  }

  updateProduct(updatedProduct: Product): Observable<any> {
    const productUrl = `${this.apiUrl}/api/Products/${updatedProduct.productId}`;

    // Set headers if needed (e.g., content type)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authService.getAuthToken()}`,
    });

    return this.http.put(productUrl, updatedProduct, { headers }).pipe(
      catchError((error) => {
        // Handle error appropriately, e.g., log or throw a custom exception
        throw error;
      })
    );
  }

  addProduct(product: Product): Observable<any> {
    const productUrl = `${this.apiUrl}/api/Products/post`;

    // Set headers if needed (e.g., content type)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authService.getAuthToken()}`,
    });

    return this.http.post(productUrl, product, { headers }).pipe(
      catchError((error) => {
        // Handle error appropriately, e.g., log or throw a custom exception
        throw error;
      })
    );
  }

}

export interface Product {
  productId: number;
  productName: string;
  price: number;
  categoryId: number;
  category: string;
  createdAt: string | null;
  updatedAt: string | null;
  status: boolean | string;
}