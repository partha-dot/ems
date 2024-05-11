import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // baseUrl = 'http://localhost:8000/api';
  // baseUrl = 'https://iot.wrongcode.in/backend/api';
  // baseUrl = 'http://51.20.92.59:8000/api';
  baseUrl = 'http://13.49.80.167:8000/api';

  token:any;
    baseURL: any;
  constructor(private http: HttpClient){ }

  login(data: any): Observable<any> {
    const url = `${this.baseUrl}/auth/login`;
    return this.http.post(url, data);
  }
  showMsg(){

  }

  /**
   * ******************* SUMAN ************************************
   * @param flag : for detection of API Method (0 => GET, 1=> POST)
   * @param api_name :  Name of the api in which we are oing to hit for fetching / posting data
   * @param data : credentials which i have to send to API
   * @returns : retuns as Observable
   */
    call_api = (flag:number,api_name:string,data:any): Observable<any> => {
        const api_url = `http://13.49.80.167:8000/${api_name}`;
        if(flag > 0){
            /*** For Posting data into API */
            return this.http.post(api_url,data);
            /*** End */
        }
        else{
            /*** For getting data from API  */
            return this.http.get(api_url,{params:data ? data : ''});
            /*** End */
        }
    }

 /*** End */

}
