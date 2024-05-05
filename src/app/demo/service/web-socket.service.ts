import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: WebSocket;
  private baseURL:string="ws://192.168.29.120:8000/api/ws_routes/ws/EMS/"
  constructor() { }

  public connect(url: string): Observable<any> {
    this.socket = new WebSocket(this.baseURL+url);

    return new Observable(observer => {
      this.socket.onopen = (event) => {
        console.log('WebSocket connected');
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
      };

      return () => {
        this.socket.close();
      };
    });
  }

  public sendMessage(message: any) {
    this.socket.send(JSON.stringify(message));
  }
}