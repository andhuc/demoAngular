import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getCategoryList(): Observable<Category[]> {
    const productsUrl = `${this.apiUrl}/api/Products/category`;

    // Set headers if needed (e.g., content type)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get(productsUrl, { headers }).pipe(
      map((response: any) => {
        // Assuming your API returns an array of Product objects
        return response;
      }),
      catchError((error) => {
        // Handle error appropriately, e.g., log or throw a custom exception
        throw error;
      })
    );
  }

}

export interface Category {
  categoryId: number;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}