import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';  // Import your auth service

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  addToCart(cartItem: CartItem): Observable<any> {
    const addToCartUrl = `${this.apiUrl}/api/Cart`;

    // Set headers with the JWT token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authService.getAuthToken()}`,
    });

    return this.http.post(addToCartUrl, cartItem, { headers }).pipe(
      catchError((error) => {
        // Handle error appropriately, e.g., log or throw a custom exception
        throw error;
      })
    );
  }

  getCart(): Observable<any> {
    const getCartUrl = `${this.apiUrl}/api/Cart`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authService.getAuthToken()}`,
    });

    return this.http.get(getCartUrl, { headers }).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

}

export interface CartItem {
  productId: number;
  quantity: number;
}
