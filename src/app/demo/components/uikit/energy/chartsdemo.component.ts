import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable, Subscription, switchMap, timer } from 'rxjs';
import { ApiService } from 'src/app/demo/service/api.service';
import { ProductService } from 'src/app/demo/service/product.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'src/app/demo/service/authentication.service';
import {
    ChartComponent,
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexChart
    
  } from "ng-apexcharts";
import { MessagesDemoComponent } from '../alert/messagesdemo.component';
import { webSocket, WebSocketSubject  } from 'rxjs/webSocket'; 
import { WebsocketService } from 'src/app/demo/service/web-socket.service';
  
  export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
  };
 
  
@Component({
    selector:"app-chartsdemo",
    templateUrl: './chartsdemo.component.html',
    styleUrls:['./chartsdemo.component.css'],
    
  providers: [MessageService, ConfirmationService, DatePipe]
})
export class ChartsDemoComponent implements OnInit, OnDestroy {
  @ViewChild(MessagesDemoComponent) msg!: MessagesDemoComponent;
    @ViewChild("chart") chart: ChartComponent;
    @ViewChild("chart2", { static: false }) chart2: ChartComponent
    public chartOptions: Partial<ChartOptions>;
    private websocketSubscription: Subscription;

    rpm: any;
    flow: any;
    flow2: any;

    barData: any;

    pieData: any;

    polarData: any;

    radarData: any;

    lineOptions: any;

    barOptions: any;

    pieOptions: any;

    polarOptions: any;

    donatoptions:any;

    donatdata:any;

    radarOptions: any;

    subscription: Subscription;

    selectedCountryAdvanced:any
    selectedDealer:any
    filteredCountries: any[] = [];
    filteredDealer: any[] = [];
    countries: any[] = [];
    selectedState: any = null;
    dealer!: any[];
    data1:any=[];
    cities:any=[];
    liveData:any=[];
    liveData2:any;
    currTm:any;
    currDt:any;
    flowData:any[]=[];
    flowDate:any[]=[];
    rpmData:any[]=[];
    rpmDate:any[]=[];
    user_type:any='';
    lastUpdateTime:any='';
    checked:boolean=true;
    options: any;
    options2: any;
    data: any;
    selectedAlert:any
    alert_type:string=''
    client_id:number=(+localStorage.getItem('c_id'))
    cities2:any=[
    {
      "unit_name": "Single Phase System",
      "unit": "single"
    },
    {
      "unit_name": "Two Phase System",
      "unit": "two"
    },
    {
      "unit_name": "Three Phase System",
      "unit": "three"
    }];
    items: MenuItem[] | undefined;
    activeItem: MenuItem | undefined;
    ws: WebSocketSubject<any>;
    messages: string[] = [];
  
    loginType:string=localStorage.getItem('loginType')
    constructor(private datePipe: DatePipe,public layoutService: LayoutService, private authservice:AuthenticationService,
        private fb: FormBuilder,private http:HttpClient ,private productService: ProductService, private websocketService: WebsocketService,
        private messageService: MessageService, private confirmationService: ConfirmationService,private api:ApiService) {
        this.subscription = this.layoutService.configUpdate$.subscribe(config => {
            this.initCharts();
        });
        this.connectToWebSocket();
    }
    convertToISTDateTime(utcDatetime: string) {
        const utcDateTime = new Date(utcDatetime);
        const istTime = this.datePipe.transform(utcDateTime, 'dd-MM-yyyy HH:mm:ss', '+0530');
        return istTime || '';
      }
   ggg(){
    debugger
   }
    ngOnInit() {
      
      
      this.items = [
        { label: 'Live', icon: 'pi pi-fw pi-home',routerLink: ['/app/outlet/alert']  },
        { label: 'device Info', icon: 'pi pi-fw pi-calendar',routerLink: ['/app/outlet/alert']  },
        { label: 'Graphical View', icon: 'pi pi-fw pi-pencil',routerLink: ['/app/outlet/alert']  },
        { label: 'Create Alert', icon: 'pi pi-fw pi-file',routerLink: ['/app/outlet/alert']  },
        { label: 'Historic Data', icon: 'pi pi-fw pi-cog',routerLink: ['/app/outlet/alert']  }
      ];
      this.activeItem = this.items[0];
        debugger
        this.initCharts();
        this.getDevice();

        // setInterval(()=>{
        //     this.currTm= ' '+ '| '+ new Date().toString().substring(16,24)+ ' '
        //     this.currDt= new Date().toString().substring(0,15)   
        //   ,1000})

        //   setInterval(() => {
        //     this.selectedDealer?.device_name ? this.getDeviceLiveData(this.selectedDealer?.device_name) : console.log('hii');
        //     this.getDevice();
        //   }, 20000);
          
         
      
    }
    connectToWebSocket() {
      this.websocketSubscription = this.websocketService.connect('1/1/123456789')
        .subscribe(
          (message) => {
            console.log('Received message:', message);
            // Handle received message here
          },
          (error) => {
            console.error('WebSocket error:', error);
          },
          () => {
            console.log('WebSocket connection closed');
          }
        );
    }
    ngOnDestroy() {
      this.websocketSubscription.unsubscribe();
      if (this.subscription) {
        this.subscription.unsubscribe();
    }
    }
    
    abc(){
        this.alert_type=''
        console.log(this.selectedAlert);
        this.alert_type=this.selectedAlert?.unit_name
        this.alert_type=' '+this.alert_type;
        debugger
      }
    getDevice(){
        const credentials = {
            client_id:this.client_id
          };
    const apiUrl = this.api.baseUrl;
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

  this.http.post(apiUrl+'/client/devices/list', credentials,{ headers }).subscribe(
      (response) => {
        console.log(response);
        
        this.data1=response
        this.cities=this.data1.data 
        
      },
      (error) => {
        
        console.error(error);
      }
    );
}

dateConvt(timestamp:any){
const dateObject = new Date(timestamp);

// Extract month and day
const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
const day = String(dateObject.getDate()).padStart(2, '0');

// Create the desired format
const result = `${month}/${day}`;

console.log(result); 
return result
}
getDeviceLiveData(name:any){
    // const apiUrl = this.api.baseUrl;
//   baseUrl = 'https://iot.wrongcode.in/backend/api';

  
         if(name){
            const token = localStorage.getItem('token');
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
            
            this.liveData=[];
            this.liveData2=null;
    
            const credentials = {
                device_id:name
            };
            
            this.http.post(this.api.baseUrl+'/device-data/last', credentials, { headers }).subscribe(
                (response) => {
                    
                    console.log(response);
                    
                    this.data1=response
                    this.data1=this.data1.data
                    if(this.data1) {
                        this.flowDate=[]
                        this.flowData=[]
                        this.rpmDate=[]
                        this.rpmData=[]
                        this.liveData=this.data1.chart_data_list
                        this.liveData2=this.data1.device_data_list
                        this.liveData.forEach(e => {
                            
                            this.flowDate.push(this.dateConvt(e.created_at))
                            this.flowData.push(e.flow)
                            this.rpmDate.push(this.dateConvt(e.created_at))
                            this.rpmData.push(e.rpm.toString())

                            
                            console.log(this.flowDate);
                            console.log(this.flowData);
                            console.log(this.rpmDate);
                            console.log(this.rpmData);
                            
                        });
                        
                        if(this.flowDate && this.flowData && this.rpmDate && this.rpmData){
                            this.lastUpdateTime=''
                            this.lastUpdateTime=this.convertToISTDateTime(this.liveData2.created_at)
                            console.log(this.lastUpdateTime);
                            var currentdate = new Date(); 
                            var datetime = currentdate.getDate() + "-"
                                + (currentdate.getMonth()+1)  + "-" 
                                + currentdate.getFullYear() + " "  
                                + currentdate.getHours() + ":"  
                                + currentdate.getMinutes() + ":" 
                                + currentdate.getSeconds();
                                console.log(datetime);
                                
                            
                            // this.flowDate = this.flowDate.map(value => JSON.stringify(value).replace(/[{}]/g, ''));
                            // this.flowData = this.flowData.map(value => JSON.stringify(value).replace(/[{}]/g, ''));
                            // this.rpmDate = this.rpmDate.map(value => JSON.stringify(value).replace(/[{}]/g, ''));
                            // this.rpmData = this.rpmData.map(value => JSON.stringify(value).replace(/[{}]/g, ''));
                            
                            this.initCharts();
                            
                        }
                        
                    }
                   
                    
                },
                (error) => {
                    console.error(error);
                }
                );
         }
  
}
        dateChange(i:any){
            const utcTimestamp = i;

            // Convert UTC timestamp to Date object
            const date = new Date(this.liveData2.created_at);

            // Set the desired timezone (in this case, +05:30)
            const timeZone = "Asia/Kolkata"; // Time zone identifier for Indian Standard Time

            // Options for formatting
            const options:any = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false, // 24-hour format
            timeZone: timeZone,
            };

            // Format the date
            const formattedDate = date.toLocaleString('en-US', options);

            console.log(formattedDate); 
            return formattedDate
        }
    setDevice(){
        console.log(this.selectedDealer);
        
        this.getDeviceLiveData(this.selectedDealer.device_name);


    }
    filterDealer(event: any) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.cities.length; i++) {
            const dealer = this.cities[i];
            if (dealer.device.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(dealer);
                
            }
        }
  
        this.filteredDealer = filtered;
        
    }

    initCharts() {
        
        this.chartOptions = {
            series: [44, 55, 13, 43, 22, 34, 65],
            chart: {
              width: 480,
              type: "pie"
            },
            labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            
          };

         
           

    }

   

    public generateDayWiseTimeSeries(baseval, count, yrange) {
        var i = 0;
        var series = [];
        while (i < count) {
          var x = baseval;
          var y =
            Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
    
          series.push([x, y]);
          baseval += 86400000;
          i++;
        }
        return series;
      }
    
    
}
