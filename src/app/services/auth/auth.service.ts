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
  private authTokenKey = 'authToken';

  constructor(private http: HttpClient) { }

  signIn(user: UserForm): Observable<AuthToken> {
    const signInUrl = `${this.apiUrl}/api/Auth/sign-in`;

    // Set headers if needed (e.g., content type)
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(signInUrl, user, { headers }).pipe(
      map((response: any) => {
        // Assuming your API returns the AuthToken object
        this.setAuthToken(response as AuthToken);
        return response as AuthToken;
      }),
      catchError((error) => {
        // Handle error appropriately, e.g., log or throw a custom exception
        throw error;
      })
    );
  }

  setAuthToken(token: any): void {
    localStorage.setItem(this.authTokenKey, token.accessToken);
  }

  getAuthToken(): string | null {
    const storedToken = localStorage.getItem(this.authTokenKey);
    return storedToken ? storedToken : null;
  }

  clearAuthToken(): void {
    localStorage.removeItem(this.authTokenKey);
  }

  checkToken(accessToken: string): Observable<any> {
    const checkTokenUrl = `${this.apiUrl}/api/Auth/validate-token`;
    
    // Send only the accessToken in the request body
    const requestBody = { AccessToken: accessToken };
  
    return this.http.post(checkTokenUrl, requestBody).pipe(
      map((response: any) => {
        // Handle the response as needed
        return response;
      }),
      catchError((error) => {
        // Handle error appropriately, e.g., log or throw a custom exception
        console.log(error);
        throw error;
      })
    );
  }

  async checkLogined(): Promise<boolean> {
    const token: string | null = this.getAuthToken();

    if (token) {
      try {

        await this.checkToken(token).toPromise();
        return true;

      } catch (error) {

        this.clearAuthToken();
        return false;

      }
    } else {

      this.clearAuthToken();
      return false;
      
    }
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
