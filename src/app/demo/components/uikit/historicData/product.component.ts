import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Customer, Representative } from 'src/app/demo/api/customer';
import { CustomerService } from 'src/app/demo/service/customer.service';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService, FilterService } from 'primeng/api';
import { ApiService } from 'src/app/demo/service/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Company } from 'src/app/demo/api/company';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { Device } from 'src/app/demo/api/deviceDetails';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'src/app/demo/service/authentication.service';
import { BooleanInput } from '@angular/cdk/coercion';
import { Router } from '@angular/router';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: [MessageService, ConfirmationService , DatePipe]
})
export class ProductComponent implements OnInit{
  cities: any[] | undefined;
  sourceProducts!: any[]

  targetProducts!: any[];

  selectedDevice: any | undefined;

  productDialog: boolean = false;

  products: Device[];

  product: Device=null;

  selectedProducts!: any[] | null;

  submitted: boolean = false;
  client_id:number=(+localStorage.getItem('c_id'));
  statuses!: any[];
  data1:any=[]
  data2:any=[]
  fromDate:any='';
  toDate:any='';
  device:any='';
  reportData:FormGroup;
  spinner:boolean=false;
  showDragandDrop
  fastLoading:number=0
  user_type:any;
  DeviceUrl:any;
  cols:any[]=[];
  r: boolean = false;
    y: boolean = false;
    b: boolean = false;
    r_y: boolean = false;
    y_b: boolean = false;
    b_y: boolean = false;
    curr1: boolean = false;
    curr2: boolean = false;
    curr3: boolean = false;
    eng: boolean = false;
    pf: boolean = false;
    freq: boolean = false;
    runhr: boolean = false;
    totkw: boolean = false;
    totkva: boolean = false;
    totkvar: boolean = false;
  constructor( private router: Router, private carService: ProductService, private cdr: ChangeDetectorRef,private authservice:AuthenticationService,private filterService: FilterService,private fb: FormBuilder,private http:HttpClient ,private productService: ProductService, private messageService: MessageService,private datePipe: DatePipe, private confirmationService: ConfirmationService,private api:ApiService) { }

  ngOnInit() {
    // this.openNew();
    this.showDragandDrop=false;
    this.cols = [ 
      // { 
      //     field: 'sl_no', 
      //     col: 'Sl No.'
      // }, 
      { 
          field: 'date', 
          col: 'Date'
      }, 
      { 
          field: 'time', 
          col: 'Time'
      }, 
      { 
        field: 'device', 
        col: 'Device Name'
      },
      // { 
      //   field: 'device_name', 
      //   col: 'Device Name'
      // }
  ];
    this.sourceProducts=[
      
      {field: 'r', col:"Voltage R"},
      {field: 'y', col:"Voltage Y"},
      {field: 'b', col:"Voltage B"},
      {field: 'r_y', col:"Voltage R_Y"},
      {field: 'y_b', col:"Voltage Y-B"},
      {field: 'b_y', col:"Voltage B-R"},
      {field: 'curr1',col:"Current R"},
      {field: 'curr2',col:"Current Y"},
      {field: 'curr3',col:"Current B"},
      {field: 'eng1+eng2+eng3',col:"Total Energy"},
      {field: 'pf',col:"Average PF"},
      {field: 'freq',col:"Frequency"},
      {field: 'runhr',col:"Runhr"},
      {field: 'totkw',col:"TotkW"},
      {field: 'totkva',col:"TotkVA"},
      {field: 'totkvar',col:"TotkVAr"}
    ]
     
    this.targetProducts = [
      { 
        field: 'date', 
        col: 'Date'
    }, 
    { 
        field: 'time', 
        col: 'Time'
    }, 
    { 
      field: 'device', 
      col: 'Device Name'
    }
    ];
    this.user_type=localStorage.getItem('u_type')
   
    this.reportData = this.fb.group({
      d_id: ['', Validators.required],
      fdate: ['', Validators.required],
      tdate: ['', [Validators.required]]
    });
    this.product = {};
    this.submitted = false;
    this.productDialog = true;
    this.getDeviceDATA();
  // this.openNew();
 
  // setInterval(() => {
  //   this.device ? this.saveProduct() : console.log('No Data');
  // }, 10000);
  }
  convertToISTDateTime(utcDatetime: string) {
    const utcDateTime = new Date(utcDatetime);
    const istTime = this.datePipe.transform(utcDateTime, 'HH:mm:ss', '+0530');
    return istTime || '';
  }
  getDeviceDATA(){
const apiUrl = this.api.baseUrl;
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
  const credentials = {
    client_id:this.client_id  
  };
  this.http.post(apiUrl+'/client/devices/list',credentials, { headers }).subscribe(
      (response) => {
        console.log(response);
        
        this.data2=response
        this.cities=this.data2.data 
        
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

  openNew() {
    this.cols = [];
      console.log(this.targetProducts);
      this.showDragandDrop=false;
      for(let i=0;i<this.targetProducts.length;i++){
        this.cols.push(this.targetProducts[i])
      }
      debugger
      console.log(this.cols);
      if(this.cols.some(p => p.field == "r")){
        this.r=true
      }
      if(this.cols.some(p => p.field == "y")){
        this.y=true
      }
      if(this.cols.some(p => p.field == "b")){
        this.b=true
      }
      if(this.cols.some(p => p.field == "r_y")){
        this.r_y=true
      }
      if(this.cols.some(p => p.field == "y_b")){
        this.y_b=true
      }
      if(this.cols.some(p => p.field == "b_y")){
        this.b_y=true
      }
      if(this.cols.some(p => p.field == "curr1")){
        this.curr1=true
      }if(this.cols.some(p => p.field == "curr2")){
        this.curr2=true
      }if(this.cols.some(p => p.field == "curr3")){
        this.curr3=true
      }if(this.cols.some(p => p.field == "eng")){
        this.eng=true
      }if(this.cols.some(p => p.field == "pf")){
        this.pf=true
      }if(this.cols.some(p => p.field == "freq")){
        this.freq=true
      }if(this.cols.some(p => p.field == "runhr")){
        this.runhr=true
      }if(this.cols.some(p => p.field == "totkw")){
        this.totkw=true
      }if(this.cols.some(p => p.field == "totkva")){
        this.totkva=true
      }if(this.cols.some(p => p.field == "totkva")){
        this.totkvar=true
      }
      // else{
      //   this.r= false;
      //   this.y= false;
      //   this.b= false;
      //   this.r_y= false;
      //   this.y_b= false;
      //   this.b_y= false;
      //   this.curr1= false;
      //   this.curr2= false;
      //   this.curr3= false;
      //   this.eng= false;
      //   this.pf= false;
      //   this.freq= false;
      //   this.runhr= false;
      //   this.totkw= false;
      //   this.totkva= false;
      //   this.totkvar= false;
      // }
      debugger
      
  }

  deleteSelectedProducts() {
      this.confirmationService.confirm({
          message: 'Are you sure you want to delete the selected products?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this.products = this.products.filter((product_id) => !this.selectedProducts?.includes(product_id));
              this.selectedProducts = null;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
          }
      });
  }

  editProduct(product: Device) {
      this.product = { ...product };
      this.productDialog = true;
  }

  deleteProduct(product: Company) {
      this.confirmationService.confirm({
          message: 'Are you sure you want to delete ' + product.user_name + '?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this.DeleteCompany(product.user_id);
          
          }
      });
  }

  hideDialog() {
      this.productDialog = false;
      this.submitted = false;
  }
  

  saveProduct() {
    this.fromDate='';
    this.toDate='';
    this.device='';
    
      this.submitted = true;
      this.selectedDevice;
      this.device=this.reportData.controls['d_id'].value.device;
      this.fromDate=this.reportData.controls['fdate'].value;
      this.toDate=this.reportData.controls['tdate'].value;
      const credentials = {
        client_id:this.client_id,
        start_date:this.reportData.controls['fdate'].value,
        end_date:this.reportData.controls['tdate'].value,
        device:this.device,
        device_id:this.reportData.controls['d_id'].value.device_id
      };
      // if(this.device){
      //   this.fastLoading+=1
      //   this.fastLoading==1?this.spinner=true:this.spinner=false;
      // }
      this.spinner=true
      const apiUrl = this.api.baseUrl;
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
      
      this.productDialog = false;
      this.http.post(apiUrl+'/client/devices/energy_data', credentials,{ headers }).subscribe(
        (response) => {
          this.spinner=false;
          console.log(response);
          this.data1=response
          this.products=this.data1.data
          this.products.forEach(e=>{
            e.time=this.convertToISTDateTime(e.created_at)
          })
          this.products = [...this.products];
          
          this.product = {};
          this.showDragandDrop=true;
          // this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Get All Data', life: 3000 });
          
        },
        (error) => { 
        if(error.status=='401'){
          this.router.navigate(['/']);
          debugger
         }
        console.log(error.status);
          if(error.status==401){
            // this.authservice.logout();
        }
          console.error(error);
        }
      );
      
  }

  


  updateCompany(id,name){
      const credentials = {
          product_id:id,
          product_name:name
        };
      const apiUrl = this.api.baseUrl;
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
      
      this.http.post(apiUrl+'/master/edit_product_name', credentials,{ headers }).subscribe(
          (response) => {
            console.log(response);
            
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Company Updated', life: 3000 });
            this.getDeviceDATA();
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
  AddCompany(name){
      const credentials = {
          product_name:name
        };
      const apiUrl = this.api.baseUrl;
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
      
      this.http.post(apiUrl+'/master/add_product_name', credentials,{ headers }).subscribe(
          (response) => {
            console.log(response);
            
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Company Created', life: 3000 });
            this.getDeviceDATA();
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
  DeleteCompany(id){
      const credentials = {
          product_id:id
        };
      const apiUrl = this.api.baseUrl;
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
      
      this.http.post(apiUrl+'/master/delete_product_name', credentials,{ headers }).subscribe(
          (response) => {
            console.log(response);
            
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Company Deleted', life: 3000 });
            this.getDeviceDATA();
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
  exportToExcel() {
    const data: any[] = []; // Your table data array
  
    // Add header row
    const header = ['Sl No.', 'DATE', 'TIME', 'DEVICE ID', 'DC BUS VOLTAGE (V)', 'OUTPUT CURRENT (A)', 'SETTINGS FREQ. (HZ)', 'RUNNING FREQ. (HZ)', 'RPM', 'FLOW (%)'];
    data.push(header);
  
    // Add data rows
    for (let i = 0; i < this.products.length; i++) {
      const rowData = [
        i + 1,
        this.products[i].date,
        this.products[i].time,
        this.products[i].device_id,
        this.products[i].dc_bus_voltage,
        this.products[i].output_current,
        this.products[i].settings_freq,
        this.products[i].running_freq,
        this.products[i].rpm,
        this.products[i].flow
      ];
      data.push(rowData);
    }
  
    // Create a worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
  
    // Create a workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    // Save the workbook as an Excel file
    XLSX.writeFile(wb, 'Report_data.xlsx');
  }
  
}
