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
    ApexChart,
  } from "ng-apexcharts";

import { MessagesDemoComponent } from '../alert/messagesdemo.component';
import { webSocket, WebSocketSubject  } from 'rxjs/webSocket';
import { WebsocketService } from 'src/app/demo/service/web-socket.service';
import { Router } from '@angular/router';
  export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
  };


  interface EnergyData {
    energy_data_id: number;
    client_id: number;
    device_id: number;
    device: string;
    do_channel: number;
    e1: number;
    e2: number;
    e3: number;
    r: number;
    y: number;
    b: number;
    r_y: number;
    y_b: number;
    b_y: number;
    curr1: number;
    curr2: number;
    curr3: number;
    activep1: number;
    activep2: number;
    activep3: number;
    apparentp1: number;
    apparentp2: number;
    apparentp3: number;
    pf1: number;
    pf2: number;
    pf3: number;
    freq: number;
    reactvp1: number;
    reactvp2: number;
    reactvp3: number;
    avaragevln: number;
    avaragevll: number;
    avaragecurrent: number;
    totkw: number;
    totkva: number;
    totkvar: number;
    runhr: number;
    date: string;
    time: string;
    created_at: string;
  }
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

  
  public activeOptionButton = "all";
  public updateOptionsData = {
    "1m": {
      xaxis: {
        min: new Date("28 Jan 2013").getTime(),
        max: new Date("27 Feb 2013").getTime()
      }
    },
    "6m": {
      xaxis: {
        min: new Date("27 Sep 2012").getTime(),
        max: new Date("27 Feb 2013").getTime()
      }
    },
    "1y": {
      xaxis: {
        min: new Date("27 Feb 2012").getTime(),
        max: new Date("27 Feb 2013").getTime()
      }
    },
    "1yd": {
      xaxis: {
        min: new Date("01 Jan 2013").getTime(),
        max: new Date("01 Jan 2013").getTime()
      }
    },
    all: {
      xaxis: {
        min: undefined,
        max: undefined
      }
    }
  };



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
    spinner:boolean=false;
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
      "unit_name": "Single Phase",
      "unit": "single"
    },
    {
      "unit_name": "Two Phase",
      "unit": "two"
    },
    {
      "unit_name": "Three Phase",
      "unit": "three"
    }];
    items: MenuItem[] | undefined;
    activeItem: MenuItem | undefined;
    ws: WebSocketSubject<any>;
    messages: string[] = [];

    selectedPhase:any={
    "unit_name": "Single Phase",
    "unit": "single"}
    selectedDevice:any;
    loginType:string=localStorage.getItem('loginType');
    EnergyData:any=[]
    avgPF:number;
    m_e1:number=0;
    m_e2:number=0;
    m_e3:number=0;

    td_e1:number=0;
    td_e2:number=0;
    td_e3:number=0;

    ye_e1:number=0;
    ye_e2:number=0;
    ye_e3:number=0;

    tot_e1:number=0;
    tot_e2:number=0;
    tot_e3:number=0;
    weeklyPaiData:any[]=[];
    weekdayName: any[]=[];
    weekData: any[]=[];
    constructor(private router: Router,private datePipe: DatePipe,public layoutService: LayoutService, private authservice:AuthenticationService,


        private fb: FormBuilder,private http:HttpClient ,private productService: ProductService, private websocketService: WebsocketService,

        private messageService: MessageService, private confirmationService: ConfirmationService,private api:ApiService) {
        this.subscription = this.layoutService.configUpdate$.subscribe(config => {
            this.initCharts();
        });

    }
    convertToISTDateTime(utcDatetime: string) {
        const utcDateTime = new Date(utcDatetime);
        const istTime = this.datePipe.transform(utcDateTime, 'dd-MM-yyyy HH:mm:ss', '+0530');
        return istTime || '';
      }
   ggg(){
    // //debugger
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
        // //debugger
        // this.initCharts();
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
    
    connectToWebSocket(c_id,d_id,d_name) {
      this.spinner=true;
      this.websocketSubscription = this.websocketService.connect(c_id,d_id,d_name)
        .subscribe(
          (message) => {
            console.log('Received message:', message);
            const jsonString = message
            const AllData: any = JSON.parse(jsonString);
            const energyData: EnergyData = AllData.lastdata;
            this.weeklyPaiData = AllData.lastdata_weekdata;
            if(this.weeklyPaiData.length>0){
            this.initCharts();
            }
            this.m_e1=0
            this.m_e2=0
            this.m_e3=0
            this.avgPF=0
            console.log(energyData);
            console.log(this.weeklyPaiData);
            this.EnergyData=energyData
            const m_e1=this.EnergyData.e1 - this.EnergyData.e1_past_month
            const m_e2=this.EnergyData.e2 - this.EnergyData.e2_past_month
            const m_e3=this.EnergyData.e3 - this.EnergyData.e3_past_month
            this.m_e1=parseFloat(m_e1?m_e1.toFixed(2):'0');
            this.m_e2=parseFloat(m_e2?m_e2.toFixed(2):'0');
            this.m_e3=parseFloat(m_e3?m_e3.toFixed(2):'0');

            this.td_e1=0
            this.td_e2=0
            this.td_e3=0
            const td_e1=this.EnergyData.e1 - this.EnergyData.e1_yesterday
            const td_e2=this.EnergyData.e2 - this.EnergyData.e2_yesterday
            const td_e3=this.EnergyData.e3 - this.EnergyData.e3_yesterday
            this.td_e1=parseFloat(td_e1?td_e1.toFixed(2):'0');
            this.td_e2=parseFloat(td_e2?td_e2.toFixed(2):'0');
            this.td_e3=parseFloat(td_e3?td_e3.toFixed(2):'0');

            this.ye_e1=0
            this.ye_e2=0
            this.ye_e3=0
            const ye_e1=this.EnergyData.e1 - this.EnergyData.e1_past_year
            const ye_e2=this.EnergyData.e2 - this.EnergyData.e2_past_year
            const ye_e3=this.EnergyData.e3 - this.EnergyData.e3_past_year
            this.ye_e1=parseFloat(ye_e1?ye_e1.toFixed(2):'0');
            this.ye_e2=parseFloat(ye_e2?ye_e2.toFixed(2):'0');
            this.ye_e3=parseFloat(ye_e3?ye_e3.toFixed(2):'0');

            this.tot_e1=0
            this.tot_e2=0
            this.tot_e3=0
            // const tot_e1=this.EnergyData.e1 - this.EnergyData.e1_past_month
            // const tot_e2=this.EnergyData.e2 - this.EnergyData.e2_past_month
            // const tot_e3=this.EnergyData.e3 - this.EnergyData.e3_past_month
            this.tot_e1=parseFloat(this.EnergyData?.e1?this.EnergyData?.e1.toFixed(2):0);
            this.tot_e2=parseFloat(this.EnergyData?.e2?this.EnergyData?.e2.toFixed(2):0);
            this.tot_e3=parseFloat(this.EnergyData?.e3?this.EnergyData?.e3.toFixed(2):0);
            this.avgPF=this.EnergyData.pf1+this.EnergyData.pf2+this.EnergyData.pf3
            this.avgPF=parseFloat(this.avgPF?this.avgPF.toFixed(2):'0');
            this.spinner=false;
            // Handle received message here
          },
          (error) => { 
        if(error.status=='401'){
          this.router.navigate(['/']);
          debugger
         }
        console.log(error.status);
            this.spinner=false;
            console.error('WebSocket error:', error);
          },
          () => {
            this.spinner=false;
            console.log('WebSocket connection closed');
          }
        );

    }
    // ngOnDestroy() {
    //   this.websocketSubscription.unsubscribe();
    //   if (this.subscription) {
    //     this.subscription.unsubscribe();
    // }
    // }
    setPhase(i:any){
        debugger
        console.log(i,this.selectedPhase)
    }

    abc(){
        this.alert_type=''
        console.log(this.selectedAlert);
        this.alert_type=this.selectedAlert?.unit_name
        this.alert_type=' '+this.alert_type;
        //debugger
      }
    getDevice(){
        const credentials = {
            client_id:this.client_id
          };
    const apiUrl = this.api.baseUrl;
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
  this.spinner=true;
  this.http.post(apiUrl+'/client/devices/list', credentials,{ headers }).subscribe(
      (response) => {
        console.log(response);
        this.spinner=false
        this.data1=response
        this.cities=this.data1.data
        this.selectedDealer=this.cities[0]
        this.getDeviceLiveData(this.selectedDealer.device,this.selectedDealer.device_id);

        console.log(this.selectedDealer);
        

      },
      (error) => { 
        if(error.status=='401'){
          this.router.navigate(['/']);
          debugger
         }
        console.log(error.status);
        this.spinner=false
        if(error.status=='401'){
          this.router.navigate(['/']);
          debugger
         }
        console.log(error.status);
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
      getDeviceLiveData(name:any,id:number){
      
      this.connectToWebSocket(this.client_id,id,name);
      console.log(this.websocketService.socketStatus);
      this.spinner=true
      if(this.websocketService.resData){
        console.log(this.websocketService.resData);
        
      }
      debugger
        //  if(name){
        //     const token = localStorage.getItem('token');
        //     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

        //     this.liveData=[];
        //     this.liveData2=null;

        //     const credentials = {
        //         device_id:name
        //     };

        //     this.http.post(this.api.baseUrl+'/device-data/last', credentials, { headers }).subscribe(
        //         (response) => {

        //             console.log(response);

        //             this.data1=response
        //             this.data1=this.data1.data
        //             if(this.data1) {
        //                 this.flowDate=[]
        //                 this.flowData=[]
        //                 this.rpmDate=[]
        //                 this.rpmData=[]
        //                 this.liveData=this.data1.chart_data_list
        //                 this.liveData2=this.data1.device_data_list
        //                 this.liveData.forEach(e => {

        //                     this.flowDate.push(this.dateConvt(e.created_at))
        //                     this.flowData.push(e.flow)
        //                     this.rpmDate.push(this.dateConvt(e.created_at))
        //                     this.rpmData.push(e.rpm.toString())


        //                     console.log(this.flowDate);
        //                     console.log(this.flowData);
        //                     console.log(this.rpmDate);
        //                     console.log(this.rpmData);

        //                 });

        //                 if(this.flowDate && this.flowData && this.rpmDate && this.rpmData){
        //                     this.lastUpdateTime=''
        //                     this.lastUpdateTime=this.convertToISTDateTime(this.liveData2.created_at)
        //                     console.log(this.lastUpdateTime);
        //                     var currentdate = new Date();
        //                     var datetime = currentdate.getDate() + "-"
        //                         + (currentdate.getMonth()+1)  + "-"
        //                         + currentdate.getFullYear() + " "
        //                         + currentdate.getHours() + ":"
        //                         + currentdate.getMinutes() + ":"
        //                         + currentdate.getSeconds();
        //                         console.log(datetime);


        //                     this.initCharts();

        //                 }

        //             }


        //         },
        //         (error) => { 
        // if(error.status=='401'){
        //   this.router.navigate(['/']);
        //   debugger
        //  }
        // console.log(error.status);
        //             console.error(error);
        //         }
        //         );
        //  }

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

        this.getDeviceLiveData(this.selectedDealer.device,this.selectedDealer.device_id);


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
    getWeekdayName(dateString: string): string {
      const date = new Date(dateString);
      const options:any = { weekday: 'long' };
      return date.toLocaleDateString('en-US', options);
    }
    
    initCharts() {
      this.weekdayName=[];
      this.weekData=[];
      this.weeklyPaiData.forEach(e=>{
        e.day=this.getWeekdayName(e.date);
        this.weekdayName.push(this.getWeekdayName(e.date));
        this.weekData.push(Number(e.e1_diff+e.e2_diff+e.e3_diff));
      })
      if(this.weekdayName.length>0 && this.weekData.length>0){
        console.log(this.weekdayName,this.weekData);
      
        this.chartOptions = {
            series: this.weekData,
            chart: {
            //   width: 480,
              type: "pie"
            },
            labels:this.weekdayName,

            responsive: [
                {
                  breakpoint: 1349,
                  options: {
                    // chart: {
                    //   width: 480
                    // },
                    legend: {
                      position: "bottom"
                    }
                  }
                }
              ]

          };
      }
      else{
        console.log(this.weekdayName,this.weekData);
      
        this.chartOptions = {
            series: [100],
            chart: {
            //   width: 480,
              type: "pie"
            },
            labels:['Sunday'],

            responsive: [
                {
                  breakpoint: 1349,
                  options: {
                    // chart: {
                    //   width: 480
                    // },
                    legend: {
                      position: "bottom"
                    }
                  }
                }
              ]

          };
      }
      


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

    ngOnDestroy() {
      // this.websocketSubscription.unsubscribe();
        if (this.subscription) {
          this.subscription.unsubscribe();
      }
        
    }


}
