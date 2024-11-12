import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/demo/service/api.service';
import { CountryService } from 'src/app/demo/service/country.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
@Component({
    templateUrl: './invalidstatedemo.component.html',
    styleUrls:['./invalidstatedemo.component.scss'],
    providers:[MessageService,ConfirmationService]
})
export class InvalidStateDemoComponent implements OnInit {
    led1:boolean=false;
    led2:boolean=true;
    led3:boolean=true;
    led4:boolean=false;
    led5:boolean=false;
    led6:boolean=true;
    led7:boolean=false;
    led8:boolean=false;
    spinner:boolean=false;
    client_id:number=(+localStorage.getItem('c_id'))

    // countries: any[] = [];

    // cities: any[];

    // filteredCountries: any[] = [];

    // value1: any;

    constructor(private router: Router,private countryService: CountryService,private api:ApiService,private http:HttpClient ,private messageService: MessageService,) {
        // this.cities = [
        //     { name: 'New York', code: 'NY' },
        //     { name: 'Rome', code: 'RM' },
        //     { name: 'London', code: 'LDN' },
        //     { name: 'Istanbul', code: 'IST' },
        //     { name: 'Paris', code: 'PRS' }
        // ];
    }

    ngOnInit() {
        // this.countryService.getCountries().then(countries => {
        //     this.countries = countries;
        // });
    }

    onCheckbox1Change(event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        if (checkbox.checked) {
            this.getDevice(1,1)

          } else {
              this.getDevice(1,0)

          }
      }
      onCheckbox2Change(event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        if (checkbox.checked) {
          this.getDevice(2,1)

        } else {
            this.getDevice(2,0)

        }
      }
      onCheckbox3Change(event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        if (checkbox.checked) {
            this.getDevice(3,1)

          } else {
              this.getDevice(3,0)

          }
      }
      onCheckbox4Change(event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        if (checkbox.checked) {
            this.getDevice(4,1)

          } else {
              this.getDevice(4,0)

          }
      }
      onCheckbox5Change(event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        if (checkbox.checked) {
            this.getDevice(5,1)

          } else {
              this.getDevice(5,0)

          }
      }
      onCheckbox6Change(event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        if (checkbox.checked) {
            this.getDevice(6,1)

          } else {
              this.getDevice(6,0)

          }
      }
      onCheckbox7Change(event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        if (checkbox.checked) {
            this.getDevice(7,1)

          } else {
              this.getDevice(7,0)

          }
      }
      onCheckbox8Change(event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        if (checkbox.checked) {
            this.getDevice(8,1)

          } else {
              this.getDevice(8,0)

          }
      }
      getDevice(no,status){
        const credentials = {
            do_no:no,
            do_status:status
          };
    const apiUrl = this.api.baseUrl;
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
  this.spinner=true;
  this.http.post(apiUrl+'/mqtt/publish_io', credentials,{ headers }).subscribe(
      (res) => {
        console.log(res);
        this.spinner=false;
        const response:any=res
        if(response.status=="success"){
            this.spinner=false;
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Switch'+no+' Updated', life: 3000 });
        //   this.resetData();
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
        this.spinner=false
        if(error.status=='401'){
          this.router.navigate(['/']);
          debugger
         }
        console.log(error.status);
      }
    );
}

}
