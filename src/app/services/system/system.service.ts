import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getSystemHistory(): Observable<SystemHistory[]> {
    const systemHistoryUrl = `${this.apiUrl}/api/System/SystemHistory`;

    // Set headers if needed (e.g., content type)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getAuthToken()}`
    });

    return this.http.get(systemHistoryUrl, { headers }).pipe(
      map((response: any) => {
        return response as SystemHistory[];
      }),
      catchError((error) => {
        throw error;
      })
    );
  }
}

export interface SystemHistory {
  action: string;
  actor: any;
  table: string;
  time: Date;
  value: any;
}