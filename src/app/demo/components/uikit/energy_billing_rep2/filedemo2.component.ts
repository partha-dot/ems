import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/demo/service/api.service';

@Component({
    templateUrl: './filedemo2.component.html',
    styleUrls: ['./filedemo2.component.css'],
    providers: [MessageService, ConfirmationService]
})
export class FileDemo2Component implements OnInit {
  
    // countries=[]
    countries1 = [
        {id: 'b1', name: 'Energy Usage and Billing', link:'/usr' },
        {id: 'b2', name: 'Billing & Income', link:'/usr' },
        {id: 'b3', name: 'Monthly bill forecast', link:'/usr'  },
        {id: 'b4', name: 'Multi months bill report', link:'/usr'  },
        {id: 'b5', name: 'Battery Simulation and Billing Analysis', link:'/usr'  }
      ];
      countries2 = [{
        id: 1, name: 'Hourly Energy Consumption', link:'/usr' },
        {id: 2, name: 'Energy consumption during selected hours', link:'/usr' },
        {id: 3, name: 'Comparison Analysis for Different Meters', link:'/usr'  },
       { id: 4, name: 'Comparison Analysis on Time Basis', link:'/usr'  },
       { id: 5, name: 'Comprehensive Analysis', link:'/usr'  }
      ];
      countries3 = [{
        id: 1, name: 'Abnormal Data Analysis', link:'/usr' },
        {id: 2, name: 'Demand charges analysis', link:'/usr' },
        {id: 3, name: 'offline analysis', link:'/usr'  }
      ];
      selectedCountry1: any;
      selectedCountry2: any;
      selectedCountry3: any;
      selectedDevice:any;
      person:any=[];
      showBillingSubMenu1:boolean=false;
      showBillingSubMenu2:boolean=false;
      showBillingSubMenu3:boolean=false;
      client_id:number=(+localStorage.getItem('c_id'));
      spinner:boolean=false;
      month:any;
      year:any;
      datetime12h:any;
      selectedName:string;
      data1:any=[];
      deviceList:any=[];
      showMonth:boolean=true;
      showyear:boolean=false;
      showDateTime:boolean=false;
      showTable:boolean=false;
      selectedID:any;
      constructor(private router: Router,private fb: FormBuilder,private http:HttpClient ,

        private messageService: MessageService, private confirmationService: ConfirmationService,private api:ApiService){
    
      }
      ngOnInit(): void {
        this.getDevice();   
      }
      logMockData(data:any){
        console.log(data)
      }
      showBilling1(){
        this.showBillingSubMenu1=!this.showBillingSubMenu1
        this.showBillingSubMenu2=false;
        this.showBillingSubMenu3=false;
        debugger
      }
      showBilling2(){
        this.showBillingSubMenu2=!this.showBillingSubMenu2
        this.showBillingSubMenu1=false;
        this.showBillingSubMenu3=false;
        debugger
      }
      showBilling3(){
        this.showBillingSubMenu3=!this.showBillingSubMenu3
        this.showBillingSubMenu2=false;
        this.showBillingSubMenu1=false;
        debugger
      }
      onChange(i:any){
        this.selectedName='';
        const name:any=i.value;
        this.selectedName=name.name;
        this.selectedID=name.id;
        console.log(i.value);
        debugger
      }
      
      navigate(location: any){ 
        debugger
        // this.router.navigate(['/billingreport']);
        // this.router.navigate(location.target.value);
       }
       ShowHideTable(){
        this.showTable=!this.showTable
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
                this.deviceList=this.data1.data

      },
      (error) => { 
        if(error.status=='401'){
          this.router.navigate(['/']);
          debugger
         }
        console.log(error.status);
        this.spinner=false
        console.error(error);
      }
    )}
    dateTypeChange(val:any){
      if(val=="Y"){
        this.showyear=true;
        this.showMonth=false;
        this.showDateTime=false;
      }
      else if(val=="M"){
        this.showyear=false;
        this.showMonth=true;
        this.showDateTime=false;
      }
      else{
        this.showyear=false;
        this.showMonth=false;
        this.showDateTime=true;
      }
    }

}
