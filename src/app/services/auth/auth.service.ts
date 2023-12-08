import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  signIn(user: UserForm): Observable<AuthToken> {
    const signInUrl = `${this.apiUrl}/api/Auth/sign-in`;

    // Set headers if needed (e.g., content type)
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(signInUrl, user, { headers }).pipe(
      map((response: any) => {
        // Assuming your API returns the AuthToken object
        return response as AuthToken;
      }),
      catchError((error) => {
        // Handle error appropriately, e.g., log or throw a custom exception
        console.error('Error during sign-in:', error);
        throw error;
      })
    );
  }

}

export interface UserForm {
  Username: string;
  Password: string;
}

export interface AuthToken {
  AccessToken: string;
  Expires: number;
}
