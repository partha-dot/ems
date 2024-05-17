import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { map, Observable, pipe, pluck, Subscription, switchMap, timer } from 'rxjs';
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
    ApexAxisChartSeries,
    ApexTitleSubtitle,
    ApexDataLabels,
    ApexFill,
    ApexYAxis,
    ApexXAxis,
    ApexTooltip,
    ApexMarkers,
    ApexAnnotations,
    ApexStroke,
    ApexLegend,
    ApexPlotOptions,

  } from "ng-apexcharts";
import { MessagesDemoComponent } from '../alert/messagesdemo.component';
import { api_name } from 'src/app/demo/constants/apiName';
import { IEnergyUsed } from './energy_chart.model';


  export enum RANGE_TYPE{
      MAX="E", // end date
      MIN="S", // start date
  }

  export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
  };
  export type ChartOptions2 = {
    series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  };
  export type ChartOptions3 = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    dataLabels: ApexDataLabels;
    yaxis: ApexYAxis;
    fill: ApexFill;
    stroke: ApexStroke;
    markers: ApexMarkers;
    colors: string[];
  };
  export type ChartOptions5 = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis | ApexYAxis[];
    labels: string[];
    stroke: ApexStroke;
    markers: ApexMarkers;
    fill: ApexFill;
    tooltip: ApexTooltip;
  };
  export type ChartOptionsX = {
    series: ApexAxisChartSeries;
    chart: any; //ApexChart;
    dataLabels: ApexDataLabels;
    markers: ApexMarkers;
    title: ApexTitleSubtitle;
    fill: ApexFill;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    grid: any; //ApexGrid;
    colors: any;
    toolbar: any;
  };
  export type ChartOptions6 = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis | ApexYAxis[];
    labels: string[];
    stroke: ApexStroke;
    markers: ApexMarkers;
    fill: ApexFill;
    tooltip: ApexTooltip;
  };
  export type ChartOptions7 = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis | ApexYAxis[];
    labels: string[];
    stroke: ApexStroke;
    markers: ApexMarkers;
    fill: ApexFill;
    tooltip: ApexTooltip;
  };
  export type ChartOptions8 = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis | ApexYAxis[];
    labels: string[];
    stroke: ApexStroke;
    markers: ApexMarkers;
    fill: ApexFill;
    tooltip: ApexTooltip;
  };
  

@Component({
    selector:"app-chartsdemo1",
    templateUrl: './chartsdemo1.component.html',
    styleUrls:['./chartsdemo1.component.scss'],

  providers: [MessageService, ConfirmationService, DatePipe]
})
export class ChartsDemo1Component implements OnInit, OnDestroy {
  @ViewChild(MessagesDemoComponent) msg!: MessagesDemoComponent;
    @ViewChild("chart") chart: ChartComponent;
    @ViewChild("chart2", { static: false }) chart2: ChartComponent
    public chartOptions: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions2>;
  public chartOptions3: Partial<ChartOptions3>;
  public chartOptions33: Partial<ChartOptions3>;
  public chartOptions4: Partial<ChartOptions3>;
  public chartOptions5: Partial<ChartOptions5>;

  public chartOptions6: Partial<ChartOptions6>;
  public chartOptions7: Partial<ChartOptions7>;
  public chartOptions8: Partial<ChartOptions8>;
  public chart1options: Partial<ChartOptionsX>;
  public chart2options: Partial<ChartOptionsX>;
  public chart3options: Partial<ChartOptionsX>;
  public commonOptions: Partial<ChartOptionsX> = {
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: "straight"
    },
    toolbar: {
      tools: {
        selection: false
      }
    },
    markers: {
      size: 6,
      hover: {
        size: 10
      }
    },
    tooltip: {
      followCursor: false,
      theme: "dark",
      x: {
        show: false
      },
      marker: {
        show: false
      },
      y: {
        title: {
          formatter: function() {
            return "";
          }
        }
      }
    },
    grid: {
      clipMarkers: false
    },
    xaxis: {
      type: "datetime"
    }
  };
  public activeOptionButton = "1yd";
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

  energy_filter = new FormGroup({
      voltage_date_time:new FormControl([new Date(),new Date()]),
      current_date_time:new FormControl([new Date(),new Date()]),
      power_date_time:new FormControl([new Date(),new Date()]),
      total_date_time:new FormControl([new Date(),new Date()])

  })

  defaultDate:Date;
    title = 'My first AGM project';
    lat = 51.678418;
    lng = 7.809007;

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
    alert_type:string='';
    spinner:boolean=false;
    client_id:number=(+localStorage.getItem('c_id'))
    cities2:any=[
    {
      "unit_name": "Voltage",
      "unit": "volt"
    },
    {
      "unit_name": "Current",
      "unit": "ampere"
    },
    {
      "unit_name": "Power",
      "unit": "watt"
    },
    {
      "unit_name": "Frequency",
      "unit": "hertz"
    }];
    items: MenuItem[] | undefined;
    activeItem: MenuItem | undefined;


    loginType:string=localStorage.getItem('loginType')
    constructor(private datePipe: DatePipe,public layoutService: LayoutService, private authservice:AuthenticationService,
        private fb: FormBuilder,private http:HttpClient ,private productService: ProductService,
        private messageService: MessageService, private confirmationService: ConfirmationService,private api:ApiService) {
        this.subscription = this.layoutService.configUpdate$.subscribe(config => {
            // this.initCharts();
        });
        this.defaultDate = new Date();
    }
    convertToISTDateTime(utcDatetime: string) {
        const utcDateTime = new Date(utcDatetime);
        const istTime = this.datePipe.transform(utcDateTime, 'dd-MM-yyyy HH:mm:ss', '+0530');
        return istTime || '';
      }
   ggg(){
    // debugger
   }
    ngOnInit() {

    // console.log(new Date("28 Jan 2013").getTime());

      this.items = [
        { label: 'Live', icon: 'pi pi-fw pi-home',routerLink: ['/app/outlet/alert']  },
        { label: 'device Info', icon: 'pi pi-fw pi-calendar',routerLink: ['/app/outlet/alert']  },
        { label: 'Graphical View', icon: 'pi pi-fw pi-pencil',routerLink: ['/app/outlet/alert']  },
        { label: 'Create Alert', icon: 'pi pi-fw pi-file',routerLink: ['/app/outlet/alert']  },
        { label: 'Historic Data', icon: 'pi pi-fw pi-cog',routerLink: ['/app/outlet/alert']  }
      ];
      this.activeItem = this.items[0];
        // debugger
        this.initCharts();
        this.getDevice();

        setTimeout(() => {
            // this.getEnergyUsedByFilter('1yd');
            // this.getVoltagechartDataByFilterDate(this.energy_filter.value.voltage_date_time);
            // this.getCurrentchartDataByFilterDate(this.energy_filter.value.current_date_time)
            // this.getPowerchartDataByFilterDate(this.energy_filter.value.current_date_time)

        },1000);


        // setInterval(()=>{
        //     this.currTm= ' '+ '| '+ new Date().toString().substring(16,24)+ ' '
        //     this.currDt= new Date().toString().substring(0,15)
        //   ,1000})

        //   setInterval(() => {
        //     this.selectedDealer?.device_name ? this.getDeviceLiveData(this.selectedDealer?.device_name) : console.log('hii');
        //     this.getDevice();
        //   }, 20000);



    }


    /** Get Voltage Data by filtered Date
     * @param data: array of search Date
    */
    getVoltagechartDataByFilterDate = (data:Date[] | null = [new Date(), new Date()]) =>{
    const dt:Partial<IEnergyVoltagePowerUsedPayLoad> ={
            "client_id": this.client_id,
            "device_id": this.selectedDealer.device_id,
            "device": this.selectedDealer.device,
            "start_date_time": data[0],
            "end_date_time":data[1]
        }
        this.spinner=true;
        this.api.call_api(1,api_name.VOLTAGE_USED,dt)
        .pipe(map((x:any) => x.data))
        .subscribe(res =>{
            if(res.length > 0){
              this.spinner=false;
            let arr :Required<{name:string,type:string,data:number[]}>[] =
            [
                    {name: "R",type: "line",data: []},
                    {name: "Y",type: "line",data: []},
                    {name: "B",type: "line",data: []},
                    {name: "R-Y",type: "line",data: []},
                    {name: "Y-B",type: "line",data: []},
                    {name: "B-R",type: "line",data: []}
                ]
                let date = [];
                res.forEach(el =>{
                    date.push(this.datePipe.transform(el.created_at,'hh:mm:ss'));
                    Object.keys(el).forEach(item =>{
                        arr = arr.filter(element =>{
                            if(element.name.toLowerCase().replace('-','_') === item.toLowerCase()){
                                element.data.push(el[item])
                            }
                            return arr
                        })
                    })
                    })
                    this.chartOptions6 = {
                        series: arr,
                        chart: {
                          height: 350,
                          type: "line"
                        },
                        stroke: {
                          curve: "smooth"
                        },
                        fill: {
                          type: "solid",
                          opacity: [0.35, 1]
                        },
                        labels: date,
                        markers: {
                          size: 0
                        },
                        xaxis: {
                          labels: {
                            trim: false
                          }
                        },
                        yaxis:[
                            {
                                title: {
                                  text: "Single Phase"
                                }
                            },
                            {
                                opposite: true,
                                title: {
                                  text: "Multi phase"
                                }
                              }
                        ],
                        tooltip: {
                          shared: true,
                          intersect: false,
                          y: {
                            formatter: function(y) {
                              if (typeof y !== "undefined") {
                                return y.toFixed(2) + " ";
                              }
                              return y;
                            }
                          }
                        }

                      };
                    
                }
                else{
                  this.spinner=false
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No data avalable!!', life: 3000 });
                }
        })
    }
    /** End */

     /** Get Voltage Data by filtered Date
     * @param data: array of search Date
    */
      getCurrentchartDataByFilterDate = (data:Date[] | null = [new Date(), new Date()]) =>{
        const dt:Partial<IEnergyVoltagePowerUsedPayLoad> ={
                "client_id": this.client_id,
                "device_id": this.selectedDealer.device_id,
                "device": this.selectedDealer.device,
                "start_date_time": data[0],
                "end_date_time":data[1]
            }
            this.spinner=true;
            this.api.call_api(1,api_name.CURRENT_USED,dt)
            .pipe(map((x:any) => x.data))
            .subscribe(res =>{
                if(res.length > 0){
                  this.spinner=false;
                let arr :Required<{name:string,type:string,data:number[],filteredBy:string}>[] =
                [
                        {name: "Current Phase-1",type: "line",data: [],filteredBy:'curr1'},
                        {name: "Current Phase-2",type: "line",data: [],filteredBy:'curr2'},
                        {name: "Current Phase-3",type: "line",data: [],filteredBy:'curr3'}
                    ]
                    let date = [];
                    res.forEach(el =>{
                        date.push(this.datePipe.transform(el.created_at,'hh:mm:ss'));
                        Object.keys(el).forEach(item =>{
                            arr = arr.filter(element =>{
                                if(element.filteredBy.toLowerCase().replace('-','_') === item.toLowerCase()){
                                    element.data.push(el[item])
                                }
                                return arr
                            })
                        })
                        })
                        this.chartOptions7 = {
                            series: arr,
                            chart: {
                              height: 350,
                              type: "line"
                            },
                            stroke: {
                              curve: "smooth"
                            },
                            fill: {
                              type: "solid",
                              opacity: [0.35, 1]
                            },
                            labels: date,
                            markers: {
                              size: 0
                            },
                            xaxis: {
                              labels: {
                                trim: false
                              }
                            },
                            tooltip: {
                              shared: true,
                              intersect: false,
                              y: {
                                formatter: function(y) {
                                  if (typeof y !== "undefined") {
                                    return y.toFixed(2) + " ";
                                  }
                                  return y;
                                }
                              }
                            }
                        }
                    }
                    else{
                      this.spinner=false
                      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No data avalable!!', life: 3000 });
                    }
            })
        }
        /** End */


        /** Get Voltage Data by filtered Date
     * @param data: array of search Date
    */
        getPowerchartDataByFilterDate = (data:Date[] | null = [new Date(), new Date()]) =>{
            const dt:Partial<IEnergyVoltagePowerUsedPayLoad> ={
                    "client_id": this.client_id,
                    "device_id": this.selectedDealer.device_id,
                    "device": this.selectedDealer.device,
                    "start_date_time": data[0],
                    "end_date_time":data[1]
                }
                this.spinner=true;
                this.api.call_api(1,api_name.POWER_USED,dt)
                .pipe(map((x:any) => x.data))
                .subscribe(res =>{
                    if(res.length > 0){
                      this.spinner=false;
                    let arr :Required<{name:string,type:string,data:number[],filtered:string}>[] =
                    [
                            {name: "Active Power-1",type: "line",data: [],filtered:'activep1'},
                            {name: "Active Power-2",type: "line",data: [],filtered:'activep2'},
                            {name: "Active Power-3",type: "line",data: [],filtered:'activep3'},
                            {name: "Apparent-1",type: "line",data: [],filtered:'apparentp1'},
                            {name: "Apparent-2",type: "line",data: [],filtered:'apparentp2'},
                            {name: "Apparent-3",type: "line",data: [],filtered:'apparentp3'},
                            {name: "Power Factor-1",type: "line",data: [],filtered:'pf1'},
                            {name: "Power Factor-2",type: "line",data: [],filtered:'pf2'},
                            {name: "Power Factor-3",type: "line",data: [],filtered:'pf3'}
                        ]
                        let date = [];
                        res.forEach(el =>{
                            date.push(this.datePipe.transform(el.created_at,'hh:mm:ss'));
                            Object.keys(el).forEach(item =>{
                                arr = arr.filter(element =>{
                                    if(element.filtered.toLowerCase().replace('-','_') === item.toLowerCase()){
                                        element.data.push(el[item])
                                    }
                                    return arr
                                })
                            })
                            })
                            this.chartOptions8 = {
                                series: arr,
                                chart: {
                                  height: 350,
                                  type: "line"
                                },
                                stroke: {
                                  curve: "smooth"
                                },
                                fill: {
                                  type: "solid",
                                  opacity: [0.35, 1]
                                },
                                labels: date,
                                markers: {
                                  size: 0
                                },
                                xaxis: {
                                  labels: {
                                    trim: false
                                  }
                                },
                                yaxis:[
                                    {
                                        title: {
                                          text: "Active Power-1"
                                        }
                                    },
                                    {
                                        opposite: true,
                                        title: {
                                          text: "Power Factor"
                                        }
                                      }
                                ],
                                tooltip: {
                                  shared: true,
                                  intersect: false,
                                  y: {
                                    formatter: function(y) {
                                      if (typeof y !== "undefined") {
                                        return y.toFixed(2) + " ";
                                      }
                                      return y;
                                    }
                                  }
                                }

                              };
                        }
                        else{
                          this.spinner=false
                          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No data avalable!!', life: 3000 });
                        }
                })
            }
            getTotalchartDataByFilterDate = (data:Date[] | null = [new Date(), new Date()]) =>{
              const dt:Partial<IEnergyVoltagePowerUsedPayLoad> ={
                      "client_id": this.client_id,
                      "device_id": this.selectedDealer.device_id,
                      "device": this.selectedDealer.device,
                      "start_date_time": data[0],
                      "end_date_time":data[1]
                  }
                  this.spinner=true;
                  this.api.call_api(1,api_name.TOTAL_POWER,dt)
                  .pipe(map((x:any) => x.data))
                  .subscribe(res =>{
                      if(res.length > 0){
                        this.spinner=false;
                      let arr :Required<{name:string,type:string,data:number[]}>[] =
                      [
                              {name: "kw",type: "area",data: []},
                              {name: "kva",type: "line",data: []},
                              {name: "kvar",type: "line",data: []}
                          ]
                          let datee = [];
                          res.forEach(el =>{
                              datee.push(this.datePipe.transform(el.created_at,'hh:mm:ss'));
                              Object.keys(el).forEach(item =>{
                                  arr = arr.filter(element =>{
                                      if("tot"+element.name.toLowerCase() == item.toLowerCase()){
                                          element.data.push(el[item])
                                      }
                                      return arr
                                  })
                              })
                              }
                            
                            )
                            console.log(datee);
                              this.chartOptions5 = {
                                series: arr,
                                chart: {
                                    height: 350,
                                    type: "line"
                                  },
                                  stroke: {
                                    curve: "smooth"
                                  },
                                  fill: {
                                    type: "solid",
                                    opacity: [0.35, 1]
                                  },
                                  labels: datee,
                                  markers: {
                                    size: 0
                                  },
                                  yaxis: [
                                    {
                                      title: {
                                        text: "Energy Level"
                                      }
                                    },
                                    // {
                                    //   opposite: true,
                                    //   title: {
                                    //     text: "Series B"
                                    //   }
                                    // }
                                  ],
                                  xaxis: {
                                    labels: {
                                      trim: false
                                    }
                                  },
                                  tooltip: {
                                    shared: true,
                                    intersect: false,
                                    // y: {
                                    //   formatter: function(y) {
                                    //     if (typeof y !== "undefined") {
                                    //       return y.toFixed(0) + " ";
                                    //     }
                                    //     return y;
                                    //   }
                                    // }
                                  }
                              };
                          }
                          else{
                            this.spinner=false
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No data avalable!!', life: 3000 });
                          }
                  })
              }
            /** End */

    ngAfterViewInit(){

        /** Event Fired when Voltage Date change event occured */
        this.energy_filter.get('voltage_date_time')
        .valueChanges.subscribe(res =>{
                if(res && res.filter(el => el== null).length == 0){
                        console.log(res);
                        this.getVoltagechartDataByFilterDate(res);
                }
        })
        /* End*/

        /** Event Fired when Cuurrent Date change event occured */
        this.energy_filter.get('current_date_time')
        .valueChanges.subscribe(res =>{
            if(res && res.filter(el => el== null).length == 0){
                this.getCurrentchartDataByFilterDate(res);
         }
        })
        /*End*/

        this.energy_filter.get('power_date_time')
        .valueChanges.subscribe(res =>{
                console.log(res)
                if(res && res.filter(el => el== null).length == 0){
                    this.getPowerchartDataByFilterDate(res);
                }
        })

        this.energy_filter.get('total_date_time')
        .valueChanges.subscribe(res =>{
                console.log(res)
                if(res && res.filter(el => el== null).length == 0){
                    this.getTotalchartDataByFilterDate(res);
                }
        })
    }

    abc(){
        this.alert_type=''
        console.log(this.selectedAlert);
        this.alert_type=this.selectedAlert?.unit_name
        this.alert_type=' '+this.alert_type;
        // debugger
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
        this.spinner=false;
        this.data1=response
        this.cities=this.data1.data

      },
      (error) => {
        this.spinner=false;
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
            this.spinner=true;
            this.http.post(this.api.baseUrl+'/device-data/last', credentials, { headers }).subscribe(
                (response) => {
                  this.spinner=false;
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
                  this.spinner=false;
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
        const currentDate = new Date();
        const previousDate = new Date(currentDate);
        previousDate.setMinutes(currentDate.getMinutes() - 15);
        // previousDate.setHours(currentDate.getHours() - 1);
        // const previousDate = new Date(currentDate);
        // previousDate.setDate(currentDate.getDate() - 1);

        console.log(this.selectedDealer);
        // this.getEnergyUsedByFilter('1yd');
        this.energy_filter.patchValue({
            voltage_date_time:[previousDate,currentDate],
            current_date_time:[previousDate,currentDate],
            power_date_time:[previousDate,currentDate],
            total_date_time:[previousDate,currentDate]
        })
        // this.getVoltagechartDataByFilterDate([previousDate,currentDate]);
        // this.getCurrentchartDataByFilterDate([previousDate,currentDate])
        // this.getPowerchartDataByFilterDate([previousDate,currentDate])
        // this.getDeviceLiveData(this.selectedDealer.device_name);


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

    /**
     * For Getting chart data of `Energy Used`
     * @param mode : For detecting whether it is `Today`,`Monthly`,`Yearly` or `Total`
     */
    getEnergyUsedByFilter = (mode:string) =>{
        try{
            this.activeOptionButton = mode
            const dt:Partial<IEnergyVoltagePowerUsedPayLoad> ={
              "client_id": this.client_id,
              "device_id": this.selectedDealer.device_id,
              "device": this.selectedDealer.device,
             "start_date_time": this.getDatesAccordingToMode(mode,'E')
            }
            this.spinner=true;
            this.api.call_api(1,api_name.ENERGY_USED,dt).pipe(map((x: any) => x.data))
            .subscribe((res:Required<IEnergyUsed>[]) =>{
              this.spinner=false;
                if(res.length > 0){
                let date = [];
                let arr:Required<{name:string,data:number[],filtered:string}>[] =
                [
                    {name:'Phase-1',data:[],filtered:'e1'},
                    {name:'Phase-2',data:[],filtered:'e2'},
                    {name:'Phase-3',data:[],filtered:'e3'}
                ]
                res.forEach(el =>{
                    console.log('pahes-1')
                    date.push(el.time);
                    Object.keys(el).forEach(item =>{
                        arr = arr.filter(element =>{
                            if(element.filtered === item){
                                element.data.push(el[item])
                            }
                            return arr
                        })
                    })
                })
                    this.chartOptions2 = {
                    series: arr,
                    chart: {
                        type: "bar",
                        height: 300
                    },
                    plotOptions: {
                        bar: {
                        horizontal: false,
                        columnWidth: "55%"
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        show: true,
                        width: 2,
                        colors: ["transparent"]
                    },
                    xaxis: {
                        categories: date
                    },
                    yaxis: {
                        labels: {
                        formatter: (val) => {
                            return val  + "kWh";
                        }
                        }
                    },
                    fill: {
                        opacity: 1
                    },
                    tooltip: {
                        y: {
                        formatter: function(val) {
                            return "" + val + " kWh";
                        }
                        }
                    }
                    };
                }
            })
        }
        catch(err){
            console.log(err)
        }
    }

    /** For Getting End Date After click on Energy used
     *
     * @param mode: detecting which button is clicked
     * @param range_type: Either MAX/MIN is accepted
    */
      getDatesAccordingToMode = (mode:string,range_type:string,__date:Date = new Date()) =>{
        if(range_type == RANGE_TYPE.MIN || range_type == RANGE_TYPE.MAX){
            const date = __date;
            switch(mode){
                case '1yd': date.setDate(date.getDate() - 1);break;
                case '1m': date.setMonth(date.getMonth() - 1);break;
                case '1y': date.setFullYear(date.getFullYear() - 1);break;
                case 'all': date.setFullYear(date.getFullYear() - 2);break;break;
            }
            // return this.datePipe.transform(date,'YYYY-MM-ddhh:mm:ss');
            return date
        }
        console.log('Ivalid argument passed')
        return null;
    }
    /** End */

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        this.data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    type: 'line',
                    label: 'Phase-1',
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    data: [50, 25, 12, 48, 56, 76, 42]
                },
                {
                    type: 'bar',
                    label: 'Phase-2',
                    backgroundColor: documentStyle.getPropertyValue('--green-500'),
                    data: [21, 84, 24, 75, 37, 65, 34],
                    borderColor: 'white',
                    borderWidth: 2
                },
                {
                    type: 'bar',
                    label: 'Phase-3',
                    backgroundColor: documentStyle.getPropertyValue('--orange-500'),
                    data: [41, 52, 24, 74, 23, 21, 32]
                }
            ]
        };

        this.options2 = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };

        this.options = {
            indexAxis: 'y',
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };


        this.flow = {
            labels: ['01', '02', '03', '04', '05', '06', '07'],
            datasets: [
                {
                    label: 'Last 6 Days',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    borderColor: documentStyle.getPropertyValue('--primary-500'),
                    tension: .4
                },
                {
                    label: 'Last Week',
                    data: [28, 48, 60, 70, 66, 69, 60],
                    fill: false,
                    backgroundColor:'yellow',
                    borderColor: 'yellow',
                    tension: .4
                }
            ]

        };
        this.flow2 = {
            labels: ['01', '02', '03', '04', '05', '06', '07'],
            datasets: [
                {
                    label: 'Last 6 Days',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    borderColor: documentStyle.getPropertyValue('--primary-500'),
                    tension: .4
                },
                {
                    label: 'Last Week',
                    data: [55, 66, 70, 90, 48, 69, 30],
                    fill: false,
                    backgroundColor:'yellow',
                    borderColor: 'yellow',
                    tension: .4
                }
            ]

        };
        this.barData = {
            labels: ['01', '02', '03', '04', '05', '06', '07'],
            datasets: [
                {
                    label: 'Last 6 Days',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    borderColor: documentStyle.getPropertyValue('--primary-500'),
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'Last Week',
                    backgroundColor: 'yellow',
                    borderColor: 'yellow',
                    data: [28, 48, 40, 19, 86, 27, 80]
                }
            ]
        };

        this.barOptions = {
            plugins: {
                legend: {
                    labels: {
                        fontColor: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
            }
        };


        this.rpm = {

            labels: this.rpmDate,
            datasets: [

                {
                    label: 'RPM',
                    data: this.rpmData,
                    fill: false,
                    backgroundColor:'yellow',
                    borderColor: 'yellow',
                    tension: .4
                }
            ]
        };
        this.lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        fontColor: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
            }
        };
         this.lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        fontColor: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
            }
        }
        this.pieData = {
            labels: ['A', 'B', 'C'],
            datasets: [
                {
                    data: [540, 325, 702],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--indigo-500'),
                        documentStyle.getPropertyValue('--purple-500'),
                        documentStyle.getPropertyValue('--teal-500')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--indigo-400'),
                        documentStyle.getPropertyValue('--purple-400'),
                        documentStyle.getPropertyValue('--teal-400')
                    ]
                }]
        };
         this.pieData = {
            labels: ['Sun', 'Mon', 'Tue','Wed','Thu','Fri','Sat'],
            datasets: [
                {
                    data: [540, 325, 702,540, 325, 702,300],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--purple-500'),
                        documentStyle.getPropertyValue('--green-500'),
                        documentStyle.getPropertyValue('--indigo-500'),
                        documentStyle.getPropertyValue('--yellow-500'),
                        documentStyle.getPropertyValue('--teal-500'),
                        documentStyle.getPropertyValue('--orange-500'),
                        documentStyle.getPropertyValue('--blue-500')

                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--purple-500'),
                        documentStyle.getPropertyValue('--green-500'),
                        documentStyle.getPropertyValue('--indigo-500'),
                        documentStyle.getPropertyValue('--yellow-500'),
                        documentStyle.getPropertyValue('--teal-500'),
                        documentStyle.getPropertyValue('--orange-500'),
                        documentStyle.getPropertyValue('--blue-500')
                    ]
                }]
        };

        this.polarData = {
            datasets: [{
                data: [
                    11,
                    16,
                    7,
                    35
                ],
                backgroundColor: [
                    documentStyle.getPropertyValue('--indigo-500'),
                    documentStyle.getPropertyValue('--purple-500'),
                    documentStyle.getPropertyValue('--teal-500'),
                    documentStyle.getPropertyValue('--orange-500')
                ],
                label: 'This week'
            }],
            labels: [
                'Today',
                'Yesterday',
                'Day befor tomorrow ',
                'Last Week'
            ]
        };

        this.polarOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                r: {
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };
        this.donatoptions = {
            cutout: '60%',
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            }
        };
        this.donatdata = {
            labels: ['Sun', 'Mon', 'Tue','Wed','Thu','Fri','Sat'],
            datasets: [
                {
                    data: [540, 325, 702,540, 325, 702,300],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--purple-500'),
                        documentStyle.getPropertyValue('--green-500'),
                        documentStyle.getPropertyValue('--indigo-500'),
                        documentStyle.getPropertyValue('--yellow-500'),
                        documentStyle.getPropertyValue('--teal-500'),
                        documentStyle.getPropertyValue('--orange-500'),
                        documentStyle.getPropertyValue('--blue-500')

                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--purple-500'),
                        documentStyle.getPropertyValue('--green-500'),
                        documentStyle.getPropertyValue('--indigo-500'),
                        documentStyle.getPropertyValue('--yellow-500'),
                        documentStyle.getPropertyValue('--teal-500'),
                        documentStyle.getPropertyValue('--orange-500'),
                        documentStyle.getPropertyValue('--blue-500')
                    ]
                    }
            ]
        };

        // this.chartOptions = {
        //     series: [44, 55, 13, 43, 22, 34, 65],
        //     chart: {
        //       width: 480,
        //       type: "pie"
        //     },
        //     labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],

        //   };

        //     this.chartOptions3 = {
        //         series: [
        //           {
        //             name: "power",
        //             data: this.generateDayWiseTimeSeries(
        //               new Date("11 Feb 2017").getTime(),
        //               185,
        //               {
        //                 min: 30,
        //                 max: 90
        //               }
        //             )
        //           }
        //         ],
        //         chart: {
        //           id: "chart2",
        //           type: "line",
        //           height: 230,
        //           toolbar: {
        //             autoSelected: "pan",
        //             show: false
        //           }
        //         },
        //         colors: ["#546E7A"],
        //         stroke: {
        //           width: 3
        //         },
        //         dataLabels: {
        //           enabled: false
        //         },
        //         fill: {
        //           opacity: 1
        //         },
        //         markers: {
        //           size: 0
        //         },
        //         xaxis: {
        //           type: "datetime"
        //         }
        //       };
        //       this.chartOptions33 = {
        //         series: [
        //           {
        //             name: "Power",
        //             data: this.generateDayWiseTimeSeries(
        //               new Date("11 Feb 2017").getTime(),
        //               185,
        //               {
        //                 min: 30,
        //                 max: 90
        //               }
        //             )
        //           }
        //         ],
        //         chart: {
        //           id: "chart2",
        //           type: "line",
        //           height: 230,
        //           toolbar: {
        //             autoSelected: "pan",
        //             show: false
        //           }
        //         },
        //         colors: ["#A32409"],
        //         stroke: {
        //           width: 3
        //         },
        //         dataLabels: {
        //           enabled: false
        //         },
        //         fill: {
        //           opacity: 1
        //         },
        //         markers: {
        //           size: 0
        //         },
        //         xaxis: {
        //           type: "datetime"
        //         }
        //       };
        //       this.chartOptions4 = {
        //         series: [
        //           {
        //             name: "series1",
        //             data: this.generateDayWiseTimeSeries(
        //               new Date("11 Feb 2017").getTime(),
        //               185,
        //               {
        //                 min: 30,
        //                 max: 90
        //               }
        //             )
        //           }
        //         ],
        //         chart: {
        //           id: "chart1",
        //           height: 130,
        //           type: "area",
        //           brush: {
        //             target: "chart2",
        //             enabled: true
        //           },
        //           selection: {
        //             enabled: true,
        //             xaxis: {
        //               min: new Date("19 feb 2017").getTime(),
        //               max: new Date("14 Jun 2017").getTime()
        //             }
        //           }
        //         },
        //         colors: ["#008FKW"],
        //         fill: {
        //           type: "gradient",
        //           gradient: {
        //             opacityFrom: 0.91,
        //             opacityTo: 0.1
        //           }
        //         },
        //         xaxis: {
        //           type: "datetime",
        //           tooltip: {
        //             enabled: false
        //           }
        //         },
        //         yaxis: {
        //           tickAmount: 2
        //         }
        //       }

              // this.chartOptions5 = {
              //   series: [
              //     {
              //       name: "Voltage",
              //       data: this.generateDayWiseTimeSeries(
              //         new Date("11 Feb 2017 GMT").getTime(),
              //         20,
              //         {
              //           min: 10,
              //           max: 60
              //         }
              //       )
              //     },
              //     {
              //       name: "Power",
              //       data: this.generateDayWiseTimeSeries(
              //         new Date("11 Feb 2017 GMT").getTime(),
              //         20,
              //         {
              //           min: 10,
              //           max: 20
              //         }
              //       )
              //     },
              //     {
              //       name: "Current",
              //       data: this.generateDayWiseTimeSeries(
              //         new Date("11 Feb 2017 GMT").getTime(),
              //         20,
              //         {
              //           min: 10,
              //           max: 15
              //         }
              //       )
              //     }
              //   ],
              //   chart: {
              //     type: "area",
              //     height: 350,
              //     stacked: true,
              //     events: {
              //       selection: function(chart, e) {
              //         console.log(new Date(e.xaxis.min));
              //       }
              //     }
              //   },
              //   colors: ["#008FFB", "#00E396", "#CED4DC"],
              //   dataLabels: {
              //     enabled: false
              //   },
              //   fill: {
              //     type: "gradient",
              //     gradient: {
              //       opacityFrom: 0.6,
              //       opacityTo: 0.8
              //     }
              //   },
              //   legend: {
              //     position: "top",
              //     horizontalAlign: "left"
              //   },
              //   xaxis: {
              //     type: "datetime"
              //   }
              // };
            //   this.chart1options = {
            //     series: [
            //       {
            //         name: "R",
            //         data: this.generateDayWiseTimeSeries2(
            //           new Date("11 Feb 2017").getTime(),
            //           20,
            //           {
            //             min: 10,
            //             max: 60
            //           }
            //         )
            //       }
            //     ],
            //     chart: {
            //       id: "fb",
            //       group: "social",
            //       type: "line",
            //       height: 160
            //     },
            //     colors: ["#F81C11"],
            //     yaxis: {
            //       tickAmount: 2,
            //       labels: {
            //         minWidth: 40
            //       }
            //     }
            //   };

            //   this.chart2options = {
            //     series: [
            //       {
            //         name: "Y",
            //         data: this.generateDayWiseTimeSeries2(
            //           new Date("11 Feb 2017").getTime(),
            //           20,
            //           {
            //             min: 10,
            //             max: 30
            //           }
            //         )
            //       }
            //     ],
            //     chart: {
            //       id: "tw",
            //       group: "social",
            //       type: "line",
            //       height: 160
            //     },
            //     colors: ["#EAEA06"],
            //     yaxis: {
            //       tickAmount: 2,
            //       labels: {
            //         minWidth: 40
            //       }
            //     }
            //   };

            //   this.chart3options = {
            //     series: [
            //       {
            //         name: "B",
            //         data: this.generateDayWiseTimeSeries2(
            //           new Date("11 Feb 2017").getTime(),
            //           20,
            //           {
            //             min: 10,
            //             max: 60
            //           }
            //         )
            //       }
            //     ],
            //     chart: {
            //       id: "yt",
            //       group: "social",
            //       type: "area",
            //       height: 160
            //     },
            //     colors: ["#062FEA"],
            //     yaxis: {
            //       tickAmount: 2,
            //       labels: {
            //         minWidth: 40
            //       }
            //     }
            //   }
    }

    public updateOptions(option: any): void {
        this.activeOptionButton = option;
        this.chart2.updateOptions(this.updateOptionsData[option], false, true, true);
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
      public generateDayWiseTimeSeries2(baseval, count, yrange): any[] {
        let i = 0;
        let series = [];
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
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}


export interface IEnergyVoltagePowerUsedPayLoad{
    client_id: number,
    "device_id": number,
    "device": string,
    "end_date_time":Partial<Date>,
    "start_date_time": Date,
}
