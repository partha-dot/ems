import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: WebSocket;
  public socketStatus:boolean=false;
  client_id:number
  device_id:number
  device:string
  resData:string
  private baseURL:string="ws://13.49.80.167:8000/api/ws_routes/ws/EMS/"
  constructor(private api:ApiService,private http:HttpClient) { }

  public connect(client_id,d_id,d_name): Observable<any> {
    this.client_id=client_id;
    this.device_id=d_id;
    this.device=d_name;
    const url=`${client_id}/${d_id}/${d_name}`
    this.socket = new WebSocket(this.baseURL+url);

    return new Observable(observer => {
      this.socket.onopen = (event) => {
        this.socketStatus=true;
        console.log('WebSocket connected');
        this.callData()
        
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          observer.next(data);
          console.log(data);
          
        } catch (error) {
          observer.error(error);
          console.log(error);
          
        }
      };

      this.socket.onerror = (error) => {
        observer.error(error);
        console.log(error);
      };

      this.socket.onclose = () => {
        console.log('WebSocket closed');
        observer.complete();
        this.socketStatus=false;
      };

      return () => {
        this.socket.close();
      };
    });
  }

  public sendMessage(message: any) {
    this.socket.send(JSON.stringify(message));
  }
  callData(){
    if(this.socketStatus){
      debugger
      const credentials = {
        device:this.device,
        device_id:this.device_id,
        client_id:this.client_id
    };
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    this.http.post(this.api.baseUrl+'/device/ws_data_ems', credentials, { headers }).subscribe(
        (response) => {
        debugger
        const res:any=response
        this.resData=res.data;
          console.log(response);
      
      })
    }
  }
}