import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ViewChild, TemplateRef} from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { Product } from 'src/app/demo/api/product';
import { ApiService } from 'src/app/demo/service/api.service';
import { ProductService } from 'src/app/demo/service/product.service';
import { CrudComponent } from '../../pages/crud/crud.component';
import { Customer } from 'src/app/demo/api/customer';
import { TreeNode } from 'primeng/api';
import { AuthenticationService } from 'src/app/demo/service/authentication.service';
import { CountryService } from 'src/app/demo/service/country.service';
interface PageEvent {
    first: number;
    rows: number;
    page: number;
    last:number;
    pageCount: number;
  }
  interface Column {
    field: string;
    header: string;
}
@Component({
    templateUrl: './floatlabeldemo.component.html',
    providers: [DialogService, MessageService],
})
export class FloatLabelDemoComponent implements OnInit  {
  files!: TreeNode[];
  cols!: Column[];
  checked:boolean=true
  checked2:boolean=false
  productDialog: boolean = false;
  AddproductDialog:boolean = false;
  addDevice:FormGroup;
  products!: Product[];
  operationType:any;
  product!: Product;
  client_id:number=(+localStorage.getItem('c_id'));
  selectedProducts!: Product[] | null;
  spinner:boolean=false;
  submitted: boolean = false;
  ct:any;
  stockApi:any;
  stockList:any[]=[];
  statuses!: any[];
  loginType:string=localStorage.getItem('loginType')
 
  DeviceModel = [
    { name: 'Energy', code: 'EN' },
    { name: 'Water', code: 'WA' },
    { name: 'Power', code: 'PO' },
    { name: 'Wind', code: 'WI' }
];

  constructor(private authservice:AuthenticationService,private api:ApiService,private countryService: CountryService,private http:HttpClient,private productService: ProductService,private fb: FormBuilder, private messageService: MessageService, private confirmationService: ConfirmationService) {
    this.addDevice = this.fb.group({
      did: [''],
      // deviceName: ['', Validators.required],
      deviceId: ['', [Validators.required]],
      dmodel: ['', [Validators.required]],
      lat: ['', [Validators.required]],
      long: ['', [Validators.required]],
      imeiNo: ['', [Validators.required]],
      // sl_no: this.fb.array([]) 
    });
  }

  ngOnInit() {
    this.getAllStock();
    this.ct=this.addDevice.controls;
      this.productService.getProducts().then((data) => (this.products = data));

      this.statuses = [
          { label: 'INSTOCK', value: 'instock' },
          { label: 'LOWSTOCK', value: 'lowstock' },
          { label: 'OUTOFSTOCK', value: 'outofstock' }
      ];
  }

  openNew() {
    this.operationType="U"
      this.product = {};
      this.submitted = false;
      this.AddproductDialog = true;
  }
  openNew2() {
    this.operationType="I"
    this.product = {};
    this.submitted = false;
    this.AddproductDialog = true;
}

  public getSeverity(status: string) {
    
    return 'success'
}
  deleteSelectedProducts() {
      this.confirmationService.confirm({
          message: 'Are you sure you want to delete the selected products?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this.products = this.products.filter((val) => !this.selectedProducts?.includes(val));
              this.selectedProducts = null;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
          }
      });
  }

  editProduct(product: Product) {
    this.operationType='U'
    debugger
      this.addDevice.patchValue({
        did:product.device_id,
        // deviceName:product.device_name,
        deviceId:product.device,
        dmodel:product.model,
        lat:product.lat,
        long:product.lon,
        imeiNo:product.imei_no
        })
      this.AddproductDialog = true;
  }

  deleteProduct(did:any) {
    debugger
    // this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Device Deleted', life: 3000 });
      this.confirmationService.confirm({
          message: 'Are you sure you want to delete this Device ?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this.products = this.products.filter((val) => val.device_id !== did);
              this.product = {};
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Device Deleted', life: 3000 });
          }
      });
  }

  hideDialog() {
      this.AddproductDialog = false;
      this.productDialog = false;
      this.submitted = false;
  }
  getAllStock(){
    this.spinner=true;
    const apiUrl = this.api.baseUrl;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    const credentials = {
      client_id:this.client_id  
    };
    this.http.post(apiUrl+'/client/manage/devices/list',credentials, { headers }).subscribe(
        (response) => {
          this.spinner=false;
          console.log(response);
          this.stockApi=response
          this.stockList=this.stockApi.data;
          debugger
        },
        (error) => {
          this.spinner=false;
          console.error(error);
        }
        
      );
}
    convDt(){
      var originalTimestamp = new Date();

    // Convert to Date object
    var date = new Date(originalTimestamp);

    // Extract year, month, and day
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2); // Adding 1 because getMonth() returns 0-indexed month
    var day = ("0" + date.getDate()).slice(-2);

    // Form the desired format
    var formattedDate = year + "-" + month + "-" + day;
    return formattedDate;
    }
  saveProduct() {
      this.submitted = true;
      if(this.operationType=="I"){
        debugger
        const apiUrl = this.api.baseUrl;
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const credentials = {
          client_id:this.client_id,
          // device_name:this.ct.deviceName.value,
          device:this.ct.deviceId.value,
          model:this.ct.dmodel.value,
          lat:this.ct.lat.value,
          lon:this.ct.long.value,
          imei_no:this.ct.imeiNo.value,
          do_channel:1,
          last_maintenance:this.convDt()

          
        };
        const credentials2=[credentials]
        debugger
        this.http.post(apiUrl+'/client/manage/devices/add', credentials2,{ headers }).subscribe(
            (response) => {
              console.log(response);
                    this.spinner=false;
                    debugger
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Device Created', life: 3000 });
              this.resetData();
              this.getAllStock();
              this.hideDialog();
            },
            (error) => {
                    this.spinner=false;
                    console.log(error);
                    this.hideDialog();
                    
            }
          );
      }
      else{
        debugger
        const apiUrl = this.api.baseUrl;
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const credentials = {
          device_id:this.ct.did.value,
          client_id:this.client_id,
          // device_name:this.ct.deviceName.value,
          device:this.ct.deviceId.value,
          model:this.ct.dmodel.value,
          lat:this.ct.lat.value,
          lon:this.ct.long.value,
          imei_no:this.ct.imeiNo.value,
          do_channel:1,
          // last_maintenance:this.convDt()

          
        };
        debugger
        this.http.post(apiUrl+'/client/manage/devices/edit', credentials,{ headers }).subscribe(
            (response) => {
              console.log(response);
                    this.spinner=false;
                    debugger
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Device Updated', life: 3000 });
              this.resetData();
              this.getAllStock();
              this.hideDialog();
            },
            (error) => {
                    this.spinner=false;
                    console.log(error);
                    this.hideDialog();
                    
            }
          );
      }
      
  }
  resetData(){
    this.addDevice.reset();
      }
  findIndexById(id: string): number {
      let index = -1;
      for (let i = 0; i < this.products.length; i++) {
          if (this.products[i].id === id) {
              index = i;
              break;
          }
      }

      return index;
  }

  createId(): string {
      let id = '';
      var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (var i = 0; i < 5; i++) {
          id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return id;
  }

 
}