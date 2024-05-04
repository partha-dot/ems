import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  // baseUrl = 'http://localhost:8000/api';
  // baseUrl = 'https://iot.wrongcode.in/backend/api';
  baseUrl = 'http://51.20.92.59:8000/api';
 
  token:any;
    baseURL: any;
  constructor(private http: HttpClient){ }

  login(data: any): Observable<any> {
    const url = `${this.baseUrl}/auth/login`;
    return this.http.post(url, data);
  }
  showMsg(){

  }
}
