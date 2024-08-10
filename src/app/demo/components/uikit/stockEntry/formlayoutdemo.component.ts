import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Renderer2,OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Company } from 'src/app/demo/api/company';
import { ApiService } from 'src/app/demo/service/api.service';
interface DeviceData {
    client_id: number;
    create_by: number;
    created_at: string;
    device: string;
    device_id: number;
    device_scheduling_id: number;
    device_type: string;
    do_channel: number;
    relay_close_time: string;
    timer_start_hours: string;
    timer_start_minutes: string;
    timer_stop_hours_1: string;
    timer_stop_minutes_1: string;
    updated_at: string;
  }
@Component({
    templateUrl: './formlayoutdemo.component.html',
    providers:[MessageService,ConfirmationService]
})
export class FormLayoutDemoComponent implements OnInit{
    selectedCountryAdvanced:any
    selectedDealer:DeviceData[]
    filteredCountries: any[] = [];
    filteredDealer: DeviceData[]
    countries: any[] = [];
    selectedState: any = null;
    stockIn: FormGroup;
    spinner:boolean=false;
    data: any;
    selectedAlert:any
    alert_type:string=''
    client_id:number=(+localStorage.getItem('c_id'))
    cities2:any=[
    {
      "unit_name": "Energy",
      "unit": "EN"
    },
    {
      "unit_name": "Water",
      "unit": "WA"
    },
    {
      "unit_name": "Wind",
      "unit": "WI"
    }];
    states: any[] = [
        {name: 'Arizona', code: 'Arizona'},
        {name: 'California', value: 'California'},
        {name: 'Florida', code: 'Florida'},
        {name: 'Ohio', code: 'Ohio'},
        {name: 'Washington', code: 'Washington'}
    ];

    dropdownItems = [
        { name: 'Option 1', code: 'Option 1' },
        { name: 'Option 2', code: 'Option 2' },
        { name: 'Option 3', code: 'Option 3' }
    ];

    cities1: any[] = [];


    city1: any = null;
    ct:any
    city2: any = null;
    models!: any[];
    modelList:any=[];
    product_n:string;
    dealer!: DeviceData[];
    dealerList:any=[];
    company_n:string;
    lastAddedIndex: number = -1;
    warr_in_month:any;
    modelID:any
    @ViewChild('itemInput') itemInput: ElementRef;

    constructor(private router: Router,private renderer:Renderer2,private fb: FormBuilder,private http:HttpClient ,private messageService: MessageService,
        private confirmationService: ConfirmationService,private api:ApiService){
            this.stockIn = this.fb.group({
                device_id: [0, Validators.required],
                device: ['', Validators.required],
                device_type: ['', Validators.required],
                do_channel: [0, Validators.required],
                relay_close_time:['', Validators.required],
                timer_start_hours: ['', Validators.required],
                timer_start_minutes: ['', Validators.required],
                timer_stop_hours_1: ['', Validators.required],
                timer_stop_minutes_1:['', Validators.required],

                // model_id: ['', Validators.required],
                // purchase_rate: ['', [Validators.required]],
                // purchase_by: ['', [Validators.required]],
                // purchase_date: ['', [Validators.required]],
                // warranty_expired: ['', [Validators.required]],
                // cgst_p: ['', [Validators.required]],
                // sgst_p: ['', [Validators.required]],
                // sales_rate: ['', [Validators.required]],
                // sels_warranty: ['', [Validators.required]],
                // sl_no: this.fb.array([])
              });
        }
    ngOnInit(): void {
        this.ct=this.stockIn.controls;
          this.getDevice();
        //   this.addSkill() ;
        //   this.getDealer();
        }
    resetData(){
      this.stockIn.reset();
      this.selectedCountryAdvanced=[];
      this.selectedDealer=[];
    //   this.product_n=null;
    //   this.warr_in_month=0;
    //   for (let i = 0; i <= this.skillsFormArray.length; i++) {
    //     this.skillsFormArray.removeAt(i);
    //       }
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
            this.data=response
            this.models=this.data.data
            this.filteredCountries=this.cities1[0]
            // this.getDeviceLiveData(this.selectedDealer.device,this.selectedDealer.device_id);

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
    getDeviceModel(){
        const apiUrl = this.api.baseUrl;
          const token = localStorage.getItem('token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

          this.http.get(apiUrl+'/master/model_name', { headers }).subscribe(
              (response) => {
                console.log(response);
                this.modelList=response
                this.models=this.modelList.data
                debugger
              },
              (error) => {
        if(error.status=='401'){
          this.router.navigate(['/']);
          debugger
         }
        console.log(error.status);
                console.error(error);
              }

            );
    }
    getDealer(){
      const apiUrl = this.api.baseUrl;
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

        this.http.get(apiUrl+'/seller/list', { headers }).subscribe(
            (response) => {
              console.log(response);
              this.dealerList=response
              this.dealer=this.dealerList.data
              debugger
            },
            (error) => {
        if(error.status=='401'){
          this.router.navigate(['/']);
          debugger
         }
        console.log(error.status);
              console.error(error);
            }

          );
  }
    insertStockData(){
      this.spinner=true;
      debugger

      const credentials = {
        device_id: this.selectedCountryAdvanced.device_id,
        device:this.selectedCountryAdvanced.device,
        device_type:this.selectedCountryAdvanced.device_type,
        do_channel:0,
        relay_close_time:this.ct.relay_close_time.value,
        timer_start_hours:this.ct.timer_start_hours.value,
        timer_start_minutes:this.ct.timer_start_minutes.value,
        timer_stop_hours_1:this.ct.timer_stop_hours_1.value,
        timer_stop_minutes_1:this.ct.timer_stop_minutes_1.value,
        // sels_warranty:this.formatedDate(this.ct.sels_warranty.value)
      };
      debugger
    const apiUrl = this.api.baseUrl;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    debugger
    this.http.post(apiUrl+'/mqtt/publish_schedule', credentials,{ headers }).subscribe(
        (response) => {
          console.log(response);
          const res:any=response
          debugger
          if(res.status=="success"){
            this.spinner=false;
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Settings Updated', life: 3000 });
          this.resetData();
          }
          else{
            this.spinner=false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Data Related Issue!!', life: 3000 });
          }
        },
        (error) => {
        if(error.status=='401'){
          this.router.navigate(['/']);
          debugger
         }
        console.log(error.status);
          console.error(error);
            this.spinner=false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'From Server Side !!', life: 3000 });
        }
      );
    }

    filterCountry(event: any) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.models.length; i++) {
            const country = this.models[i];
            if (country.device.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country);
                debugger
            }
        }

        this.filteredCountries = filtered;

    }
    filterDealer(event: any) {
      const filtered: any[] = [];
      const query = event.query;
      for (let i = 0; i < this.cities2.length; i++) {
          const dealer = this.cities2[i];
          if (dealer.unit_name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
              filtered.push(dealer);
              debugger
          }
      }

      this.filteredDealer = filtered;

  }
    setWarranty(){
        this.warr_in_month=this.warr_in_month?this.warr_in_month:0;
        const inputDateObject = new Date(this.ct.purchase_date.value);
        if (!isNaN(inputDateObject.getTime())) {
          inputDateObject.setMonth(inputDateObject.getMonth() + Number(this.warr_in_month));

          this.stockIn.get('warranty_expired').setValue(inputDateObject);
        } else {
          console.error('Invalid date input');
        }
        debugger
    }

      selected(){
        this.spinner=true;
        console.log(this.selectedCountryAdvanced);
        this.modelID=this.selectedCountryAdvanced.device_id;
        this.company_n=this.selectedCountryAdvanced.devices;
        debugger
        const body={
            client_id:this.client_id,
            device_id:this.selectedCountryAdvanced.device_id,
            device:this.selectedCountryAdvanced.device
        }

        const apiUrl = this.api.baseUrl;
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*',
            'Content-Type': 'application/json'
        })

        this.http.post(apiUrl+'/client/device_schedule',body,{ headers}).subscribe(
            (response) => {
                this.spinner=false;
              console.log(response);
              this.dealerList=response
            //   this.dealer=this.dealerList.data
              debugger
              if (this.dealerList?.data?.device_type === 'EN') {
                const dealer = this.cities2.find(dealer => dealer?.unit_name === 'Energy');
                if (dealer) {
                  this.selectedDealer = dealer;
                }
              }
              this.stockIn.patchValue({
                device_type: this.dealerList?.data?.device_type,
                do_channel: 0,
                relay_close_time: this.dealerList?.data?.relay_close_time,
                timer_start_hours:  this.dealerList?.data?.timer_start_hours,
                timer_start_minutes:  this.dealerList?.data?.timer_start_minutes,
                timer_stop_hours_1:  this.dealerList?.data?.timer_stop_hours_1,
                timer_stop_minutes_1:  this.dealerList?.data?.timer_stop_minutes_1
              })
            },
            (error) => {
                this.spinner=false;
        if(error.status=='401'){
          this.router.navigate(['/']);
          debugger
         }
        console.log(error.status);
              console.error(error);
            }

          );
    }


    setDealer(){
    //   console.log(this.selectedDealer);
    //   this.ct.purchase_by.setValue(this.selectedDealer.id);
    //   debugger
  }
    get skillsFormArray() {
      return this.stockIn.get('sl_no') as FormArray;
    }
    addSkill() {
      this.skillsFormArray.push(this.fb.control(''));
    }

    removeSkill(index: number) {
      this.skillsFormArray.removeAt(index);
    }
    addItem(i:any){
      if (i.keyCode === 13) {
        this.addSkill();

       this.lastAddedIndex=this.skillsFormArray.length;
        const ln = this.skillsFormArray.length;
        this.lastAddedIndex=ln-1
        // this.removeSkill(ln-1);
        debugger
      }
    }
    formatedDate(dt:any){
      const originalDateStr = dt;
      const originalDate = new Date(originalDateStr);

      const year = originalDate.getFullYear();
      const month = String(originalDate.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so add 1 and pad with 0 if needed
      const day = String(originalDate.getDate()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`;

      console.log(formattedDate);
      return formattedDate;
    }


}



