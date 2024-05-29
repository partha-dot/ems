import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ApiService } from 'src/app/demo/service/api.service';
import { AuthenticationService } from 'src/app/demo/service/authentication.service';
import { CountryService } from 'src/app/demo/service/country.service';
interface PageEvent {
  first: number;
  rows: number;
  page: number;
  last:number;
  pageCount: number;
}
@Component({
    templateUrl: './panelsdemo.component.html',
    styles: [`
    .grid-container {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      //grid-gap: 10px;
    }

    .grid-item {
      margin: 0;
     padding: 7px;
      
    }
  `],
  providers: [MessageService, ConfirmationService]
})

export class PanelsDemoComponent implements OnInit {
  visible: boolean = false;
  selectedCountryAdvanced:any;
  selectedCountries:any;
  regions: any[] = [];
  subRegion: any[] = [];
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];
  filteredCountries: any[] = [];
  filteredState: any[] = [];
  filteredCity: any[] = [];
  selectedState: any;
  selectedCity: any;
  stockIn: FormGroup;
  stockIn2: FormGroup;
  modelList:any=[];
  userList:any=[];
  product_n:string;
  company_n:string;
  lastAddedIndex: number = -1;
  warr_in_month:any;
  modelID:any
  models!: any[];
  users!: any[];
  users2!: any[];
  ct:any;
  dayOnly:any;
  stockListAll:any;
  stockList:any[]=[]
  stockApi:any
  product_store_id:number;
  spinner:boolean=false;
  address:any=''
  first: number = 0;
  rows: number = 20;
  totalPGNO:number;
  goingPage:number;
  companyList:any;
  companys:any[]=[];
  filteredDealer: any[] = [];
  pricePerMonth:Number;
  powerTariff:any[]=[];
  orgList:any[]=[];
  dayPicker:any[]=[];
  selectedSetting:any;
  settingList:any[]=[];
  selectedOrganization:any;
  client_id:number=(+localStorage.getItem('c_id'));
  user_id:number=(+localStorage.getItem('user_id'));
  constructor(private router: Router,private authservice:AuthenticationService,private api:ApiService,private countryService: CountryService,private fb: FormBuilder,private http:HttpClient, private messageService: MessageService) { 
      this.stockIn = this.fb.group({
          org: ['', Validators.required],
          country: ['', [Validators.required]],
          state: ['', [Validators.required]],
          city: ['', [Validators.required]],
          address:['', [Validators.required]],
          power_tariff:['', [Validators.required]],
          billing_data: this.fb.array([]) ,
        });
      this.powerTariff=[
        {code:"FR", name:"Fixed Rate"}
      ]
      this.dayPicker=[
        {key:1},{key:2},{key:3},{key:4},{key:5},{key:6},{key:7},{key:8},
        {key:9},{key:10},{key:11},{key:12},{key:13},{key:14},{key:15},{key:16},
        {key:17},{key:18},{key:19},{key:20},{key:21},{key:22},{key:23},{key:24},
        {key:25},{key:26},{key:27},{key:28},{key:29},{key:30}
      ]
             
  }
  
  ngOnInit() {
    
      this.ct=this.stockIn.controls;
      // this.getRegion();
      this.getCountres();
      this.getOrg();
      this.visible = true;
      // this.getSubRegion(); 
        // this.getDeviceData(); 
        // this.getOrganization();
        // this.getAllStock();
        // this.loadPage();
     

  }
  
  filterDealer(event: any) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.countries.length; i++) {
        const dealer = this.countries[i];
        if (dealer.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(dealer);

        }
    }

    this.filteredDealer = filtered;

}
filterState(event: any) {
  const filtered: any[] = [];
  const query = event.query;
  for (let i = 0; i < this.states.length; i++) {
      const dealer = this.states[i];
      if (dealer.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(dealer);

      }
  }

  this.filteredState = filtered;

}
filterCity(event: any) {
  const filtered: any[] = [];
  const query = event.query;
  for (let i = 0; i < this.cities.length; i++) {
      const dealer = this.cities[i];
      if (dealer.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(dealer);
      }
  }
  this.filteredCity = filtered;  
}
setCity(){
  debugger
}
setState(){
  this.getCity();
  debugger
}
setDevice(){
  debugger
  this.getStates();
}
  setRegion(){
    this.getSubRegion();
    debugger
  }
  setSubRegion(){
    debugger
    this.ct.sub_region.value
    this.getCountres();
  }
  setGrid(){
    debugger
    this.ct.power_tariff.value.code
  }
  setOrg(){
    debugger
    this.ct.org.value.organization_id
  }
  getOrg(){
    const apiUrl = this.api.baseUrl;
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const credentials = {
        client_id:this.client_id
      };
      this.http.post(apiUrl+'/client/manage_organization/list', credentials,{ headers }).subscribe(
          (response) => {
            console.log(response);
            const res:any=response
            this.orgList=res.data 
            console.log(this.regions);
            debugger
          },
          (error) => { 
            if(error.status=='401'){
              this.router.navigate(['/']);
              debugger
            }
            console.log(error.status);
            console.error(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'From Server Side!!', life: 3000 });
          }
          
        );
    }
  getRegion(){
    const apiUrl = this.api.baseUrl;
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
      this.http.get(apiUrl+'/common/location/regions', { headers }).subscribe(
          (response) => {
            console.log(response);
            const res:any=response
            this.regions=res.data 
            console.log(this.regions);
            debugger
          },
          (error) => { 
            if(error.status=='401'){
              this.router.navigate(['/']);
              debugger
            }
            console.log(error.status);
            console.error(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'From Server Side!!', life: 3000 });
          }
          
        );
    }
    getSubRegion(){
      const apiUrl = this.api.baseUrl;
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const region_id= this.ct.region.value.id;
        this.http.get(apiUrl+`/common/location/sub_regions?region_id=${region_id}`, { headers }).subscribe(
            (response) => {
              console.log(response);
              const res:any=response
              this.subRegion=res.data 
              console.log(this.subRegion);
              debugger
            },
            (error) => { 
              if(error.status=='401'){
                this.router.navigate(['/']);
                debugger
              }
              console.log(error.status);
              console.error(error);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'From Server Side!!', life: 3000 });
            }
            
          );
      }
      getCountres(){
        const apiUrl = this.api.baseUrl;
          const token = localStorage.getItem('token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
          // const region_id= this.ct.region.value.id;
          // const subRegion_id= this.ct.sub_region.value.id;
          // let strng=''
          // if(region_id && subRegion_id){
          //   strng=`/common/location/countries?region_id=${region_id}&sub_region_id=${subRegion_id}`
          // }
          // else{
          //   strng=`/common/location/countries`
          // }
          this.http.get(apiUrl+'/common/location/countries', { headers }).subscribe(
              (response) => {
                console.log(response);
                const res:any=response
                this.countries=res.data 
                console.log(this.countries);
                debugger
              },
              (error) => { 
                if(error.status=='401'){
                  this.router.navigate(['/']);
                  debugger
                }
                console.log(error.status);
                console.error(error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'From Server Side!!', life: 3000 });
              }
              
            );
        }
        getStates(){
          const apiUrl = this.api.baseUrl;
            const token = localStorage.getItem('token');
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
            const country_id= this.selectedCountries?.id;
            // const subRegion_id= this.ct.sub_region.value.id;
            let strng=''
            if(country_id ){
              strng=`/common/location/states?country_id=${country_id}`
            }
            else{
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Select Country first', life: 3000 });
              return
            }
            this.http.get(apiUrl+strng, { headers }).subscribe(
                (response) => {
                  console.log(response);
                  const res:any=response
                  this.states=res.data 
                  console.log(this.states);
                  debugger
                },
                (error) => { 
                  if(error.status=='401'){
                    this.router.navigate(['/']);
                    debugger
                  }
                  console.log(error.status);
                  console.error(error);
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'From Server Side!!', life: 3000 });
                }
                
              );
          }
          getCity(){
            const apiUrl = this.api.baseUrl;
              const token = localStorage.getItem('token');
              const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
              const state_id= this.selectedState?.id;
              // const subRegion_id= this.ct.sub_region.value.id;
              let strng=''
              if(state_id ){
                strng=`/common/location/cities?state_id=${state_id}`
              }
              else{
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Select State first', life: 3000 });
                return
              }
              this.http.get(apiUrl+strng, { headers }).subscribe(
                  (response) => {
                    console.log(response);
                    const res:any=response
                    this.cities=res.data 
                    console.log(this.cities);
                    debugger
                  },
                  (error) => { 
                    if(error.status=='401'){
                      this.router.navigate(['/']);
                      debugger
                    }
                    console.log(error.status);
                    console.error(error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'From Server Side!!', life: 3000 });
                  }
                  
                );
            }
  onPageChange(event: PageEvent) {
    this.first = event.first;
    this.rows = event.rows;
    this.goingPage=event.page+1;
    debugger
  }
  loadPage(){
    // const url="https://billing-application.wrongcode.in/api/stock/stock_product?page=2"
                this.spinner=true;
                const apiUrl = this.api.baseUrl;
          const token = localStorage.getItem('token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
          const credentials = {
            client_id:this.client_id
          };
          this.http.post(apiUrl+'/client/manage_user/list_user_device',credentials, { headers }).subscribe(
              (response) => {
                this.spinner=false;
                this.stockApi=response;
                this.stockListAll=this.stockApi.data;
                // this.stockList=this.stockListAll.data;
                // this.totalPGNO=this.stockListAll.last_page;
                debugger
              })
  }
  
  selectProduct(stock) {
    this.users=this.users2.filter(e=>e.organization_id==stock.organization_id)
    debugger
    // model_id: this.modelID,
    this.stockIn.patchValue({
      device_id:stock.device_id,
      org_id:stock.organization_id,
      user_id:stock.user_id,
      manage_user_device_id:stock.manage_user_device_id
    });
    debugger
      // this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: cities.name });
  }
  
  resetData(){
      this.stockIn.reset();
      this.selectedCity=[]
      this.selectedCountries=[]
      this.selectedState=[]
        }
        getOrganization(){
          const apiUrl = this.api.baseUrl;
            const token = localStorage.getItem('token');
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
            const credentials = {
              client_id:this.client_id
            };
            this.http.post(apiUrl+'/client/manage_organization/list', credentials,{ headers }).subscribe(
               (response) => {
                  console.log(response);
                  this.companyList=response
                  this.companys=this.companyList.data 
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
    getDevice(){

      const apiUrl = this.api.baseUrl;
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
      const credentials = {
        client_id:this.client_id
      };
      this.http.post(apiUrl+'/client/devices/list',credentials, { headers }).subscribe(
          (response) => {
            console.log(response);
            
            this.modelList=response
            this.models=this.modelList.data 
            
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
        // const apiUrl = this.api.baseUrl;
        //   const token = localStorage.getItem('token');
        //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
        
        //   this.http.get(apiUrl+'/master/model_name', { headers }).subscribe(
        //       (response) => {
        //         console.log(response);
        //         this.modelList=response
        //         this.models=this.modelList.data;
        //         debugger
        //       },
        //       (error) => { 
      // if(error.status=='401'){
      //   this.router.navigate(['/']);
      //   debugger
      //  }
      // console.log(error.status);
        //         console.error(error);
        //       }
              
        //     );
    }
    setUser(){
      this.users=[];
      this.users=this.users2.filter(e=>e.organization_id==this.ct.org_id.value)
      debugger
      // this.ct.org_id.value
    }
    getAllStock(){
          this.spinner=true;
          this.totalPGNO=0;
          const apiUrl = this.api.baseUrl;
          const token = localStorage.getItem('token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
        
          this.http.get(apiUrl+'/assign-device/list-origination', { headers }).subscribe(
              (response) => {
                this.spinner=false;
                console.log(response);
                this.stockApi=response
                this.stockList=this.stockApi.data;
                debugger
              },
              (error) => { 
      if(error.status=='401'){
        this.router.navigate(['/']);
        debugger
       }
      console.log(error.status);
                this.spinner=false;
                console.error(error);
              }
              
            );
    }
    deviceChange(i:any){
      const dname=this.models.filter(e=>e.device_id==i)[0].device
      this.ct.device_name.setValue(dname)
      debugger
    }
    insertSetting(){
      const obj={
        "billing_type": "FR",
        "billing_price":this.pricePerMonth,
        "billing_status": this.dayOnly,
        "billing_day": 1
      }
      const arr=[];
      arr.push(obj)
      // this.skillsFormArray.push(arr)
      debugger
                this.spinner=true;
                const credentials = {
                  client_id:this.client_id,
                  organization_id:Number(this.ct.org.value.organization_id),
                  billing_data:arr,
                  countries_id:this.selectedCountries.id,
                  regions_id:this.selectedCountries.region_id,
                  subregions_id:this.selectedCountries.subregion_id,
                  states_id:this.selectedState.id,
                  cities_id:this.selectedCity.id,
                  address:this.ct.address.value,
                  created_by:this.user_id
                };
      if(this.ct.address.value){
        debugger
        const apiUrl = this.api.baseUrl;
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
        debugger
        this.http.post(apiUrl+'/client/organization_settings', credentials,{ headers }).subscribe(
            (response) => {
              console.log(response);
                    this.spinner=false;
                    debugger
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Device Updated', life: 3000 });
              // this.resetData();
              // this.loadPage();
            },
            (error) => { 
      if(error.status=='401'){
        this.router.navigate(['/']);
        debugger
       }
      console.log(error.status);
                    this.spinner=false;
                    console.log(error);
                    
            }
          );
      }
      else{
        debugger
        const apiUrl = this.api.baseUrl;
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
        debugger
        this.http.post(apiUrl+'/client/manage_user/add_device', credentials,{ headers }).subscribe(
            (response) => {
              console.log(response);
                    this.spinner=false;
                    debugger
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Device created', life: 3000 });
              this.resetData();
              this.getAllStock();
            },
            (error) => { 
      if(error.status=='401'){
        this.router.navigate(['/']);
        debugger
       }
      console.log(error.status);
                    this.spinner=false;
                    console.error(error);
            }
          );
      }
     
    }
    
    filterCountry(event: any) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.models.length; i++) {
            const country = this.models[i];
            if (country.model_name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country);
                debugger
            }
        }

        this.filteredCountries = filtered;
        
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
    calculateOutputDate() {
        
      }
    selected(){
        console.log(this.selectedCountryAdvanced);
        this.modelID=this.selectedCountryAdvanced.model_id;
        this.product_n=this.selectedCountryAdvanced.product_name;
        this.company_n=this.selectedCountryAdvanced.company_name;
        debugger
    }
    get skillsFormArray() {
      return this.stockIn.get('billing_data') as FormArray;
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
    getSettingList(){
     this.visible = false;
      debugger
      const credentials = {
        organization_id:this.selectedOrganization.organization_id,
      };
      debugger
                this.spinner=true;
                const apiUrl = this.api.baseUrl;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    debugger
    this.http.post(apiUrl+'/client/organization_settings/list', credentials,{ headers }).subscribe(
        (response) => {
          console.log(response);
          this.spinner=false;
          const dt:any=response;
          this.settingList=dt.data;
          this.settingList.forEach(p=>{
            debugger
            p.country=this.countries.filter(e=>e.id==p.countries_id)[0].name
            p.city=this.cities.filter(e=>e.id==p.cities_id)[0].name
            p.state=this.states.filter(e=>e.id==p.state_id)[0].name
            p.orgName=this.orgList.filter(e=>e.organization_id==p.organization_id)[0].organization_name
          })
          debugger
          // this.messageService.add({ severity: 'Success', summary: 'Successful', detail: 'Assign Device Deleted', life: 3000 });
          // this.resetData();
          // this.loadPage();
        },
        (error) => { 
      if(error.status=='401'){
        this.router.navigate(['/']);
        debugger
       }
      console.log(error.status);
                this.spinner=false;
                console.error(error);
        }
      );
    }
    editSetting(data:any){
      this.stockIn.patchValue({
        
        org:this.orgList.filter(e=>e.organization_id==data.organization_id)[0],
        address:data.address,
        power_tariff:this.powerTariff.filter(e=>e.code==data.billing_type)[0],
      })
      this.dayOnly=this.dayPicker.filter(e=>e.key==data.billing_day)[0];
      this.pricePerMonth=data.billing_price;
      this.selectedCountries=this.countries.filter(e=>e.countries_id==data.countries_id)[0];
      this.selectedState=this.states.filter(e=>e.states_id==data.states_id)[0];
      this.selectedCity=this.cities.filter(e=>e.cities_id==data.cit)[0];

    }
    deleteSetting(data:any){
      
    }
      
    
}