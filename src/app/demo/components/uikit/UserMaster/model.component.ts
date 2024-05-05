
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Customer, Representative } from 'src/app/demo/api/customer';
import { CustomerService } from 'src/app/demo/service/customer.service';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ApiService } from 'src/app/demo/service/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Company } from 'src/app/demo/api/company';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ModelComponent implements OnInit{
  productDialog: boolean = false;

  products!: Company[];
  companys!: any[];
  models!: any[];

  product!: Company;

  selectedProducts!: Company[] | null;

  submitted: boolean = false;

  statuses!: any[];
  companyList:any=[]
  productList:any=[]
  modelList:any=[]
  countries: any[] | undefined;
  selectedCountry: any | undefined;
userForm: FormGroup;
ct:any;
value:any='';
editMode:boolean=false;
client_id:number=(+localStorage.getItem('c_id'))
  constructor(private formBuilder: FormBuilder,private http:HttpClient ,private productService: ProductService,
     private messageService: MessageService, private confirmationService: ConfirmationService,private api:ApiService) {
    this.userForm = this.formBuilder.group({
      organization_id: [''],
      name: [''],
      user_id:[''],
      email: [''],
      password: [''],
    });
   }
 
  ngOnInit() {
    this.ct=this.userForm.controls
  this.getDeviceCompany();
  // this.getDeviceProduct();
  this.getDeviceModel();

  }
  getDeviceModel(){
const apiUrl = this.api.baseUrl;
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
  const credentials = {
    client_id:this.client_id
  };
  this.http.post(apiUrl+'/client/manage_user/list', credentials,{ headers }).subscribe(
      (response) => {
        console.log(response);
        this.modelList=response
        this.models=this.modelList.data 
        debugger
      },
      (error) => {
        console.error(error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'From Server Side!!', life: 3000 });
      }
      
    );
}
getDeviceCompany(){
  const apiUrl = this.api.baseUrl;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    const credentials = {
      client_id:this.client_id
    };
    this.http.post(apiUrl+'/client/manage_organization/list',credentials, { headers }).subscribe(
        (response) => {
          console.log(response);
          this.companyList=response
          this.companys=this.companyList.data 
          debugger
        },
        (error) => {
          console.error(error);
        }
      );
  }

  openNew() {
    this.editMode=false
    this.userForm.reset();
      this.product = {};
      this.submitted = false;
      this.productDialog = true;
  }

  deleteSelectedProducts() {
      this.confirmationService.confirm({
          message: 'Are you sure you want to delete the selected products?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this.products = this.products.filter((organization_id) => !this.selectedProducts?.includes(organization_id));
              this.selectedProducts = null;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
          }
      });
  }
  changePass(){
    this.editMode=false
    debugger
  }

  editProduct(product: Company) {
    this.editMode=true;
    debugger
      this.product = { ...product };
      this.productDialog = true;
      this.userForm.patchValue({
        organization_id:product.organization_id,
        user_id:product.user_id,
        name:product.user_name,
        email:product.user_email,
        password:product.password,
      })
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
      // this.submitted = false;
  }

  saveProduct() {
      // this.submitted = true;
      // if(this.ct.password.value==this.value){
        debugger
        if (this.product.user_id) {

            debugger
            this.updateCompany(this.ct.organization_id.value,this.ct.user_id.value,this.ct.name.value,this.ct.email.value,this.ct.password.value?this.ct.password.value:'')
            debugger
            // this.products[this.findIndexById(this.product.organization_id)] = this.product;
        } else {
            this.AddCompany(this.ct.organization_id.value,this.ct.name.value,this.ct.email.value,this.ct.password.value,)
            
        }

        // this.products = [...this.products];
        this.productDialog = false;
        this.product = {};
    //   }
    //  else{
    //   this.messageService.add({ severity: 'error', summary: 'Error', detail: 'password and Confirm password can not matched', life: 3000 });
     
      
    //  }
      
  }

  findIndexById(id: string): number {
      let index = -1;
      for (let i = 0; i < this.products.length; i++) {
          if (this.products[i].organization_id === id) {
              index = i;
              break;
          }
      }

      return index;
  }


  updateCompany(o_id,u_id,u_name,email,pass){
      const credentials = {
          organization_id:o_id,
          user_id:u_id,
          name:u_name,
          email:email,
          
          // password:pass,
        };
      const apiUrl = this.api.baseUrl;
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
      debugger
      this.http.post(apiUrl+'/client/manage_user/edit', credentials,{ headers }).subscribe(
          (response) => {
            console.log(response);
            debugger
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
            this.getDeviceModel();
          },
          (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Data Related Issue!!', life: 3000 });
            console.error(error);
          }
        );
  } 
  AddCompany(o_id,name,email,pass){
      const credentials = {
          organization_id:o_id,
          name:name,
          email:email,
          password:pass,
          confirm_password:pass
        };
      const apiUrl = this.api.baseUrl;
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
      debugger
      this.http.post(apiUrl+'/client/manage_user/add', credentials,{ headers }).subscribe(
          (response) => {
            console.log(response);
            debugger
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
            this.getDeviceModel();
          },
          (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Data Related Issue!!', life: 3000 });
            console.error(error);
          }
        );
  }   
  DeleteCompany(user:any){
    debugger
      const credentials = {
          user_id:user
        };
      const apiUrl = this.api.baseUrl;
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
      debugger
      this.http.post(apiUrl+'/client/manage_user/delete', credentials,{ headers }).subscribe(
          (response) => {
            console.log(response);
            debugger
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
            this.getDeviceModel();
          },
          (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Data Related Issue!!', life: 3000 });
            console.error(error);
          }
        );
  }
}