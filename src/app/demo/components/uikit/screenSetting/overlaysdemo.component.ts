import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {  FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
// import { Product } from 'src/app/demo/api/product';
import { ApiService } from 'src/app/demo/service/api.service';
import { ProductService } from 'src/app/demo/service/product.service';

@Component({
    templateUrl: './overlaysdemo.component.html',
    providers: [ConfirmationService, MessageService]
})
export class OverlaysDemoComponent implements OnInit {
    formGroup: FormGroup;
    selectedOrganization:any;
    orgList:any[]=[];
    client_id:number=(+localStorage.getItem('c_id'));
    editMode:boolean=false;
    ct:any;
    // images: any[] = [];
    spiner:boolean=false;
    display: boolean = true;

    // products: Product[] = [];

    // selectedProduct: Product = {};

    // visibleSidebar1: boolean = false;

    // visibleSidebar2: boolean = false;

    // visibleSidebar3: boolean = false;

    // visibleSidebar4: boolean = false;

    // visibleSidebar5: boolean = false;

    constructor(private router: Router,private http:HttpClient,private fb: FormBuilder,private api:ApiService,private productService: ProductService, private confirmationService: ConfirmationService, private messageService: MessageService) {
        this.formGroup = this.fb.group({
            id_view_organization:[0, Validators.required],
            gv_energy_used: [false, Validators.required],
            gv_voltage:[false, Validators.required],
            gv_current:[false, Validators.required],
            gv_power:[false, Validators.required],
            mn_device_management:[false, Validators.required],
            mn_user_management:[false, Validators.required],
            en_tab_device_info:[false, Validators.required],
            en_tab_create_alert:[false, Validators.required],
            en_tab_scheduling:[false, Validators.required],
            en_tab_report_analysi:[false, Validators.required],
          });
     }

    ngOnInit() {
        this.ct=this.formGroup.controls
        this.getOrg();
        // this.productService.getProductsSmall().then(products => this.products = products);

        // this.images = [];
        // this.images.push({
        //     source: 'assets/demo/images/sopranos/sopranos1.jpg',
        //     thumbnail: 'assets/demo/images/sopranos/sopranos1_small.jpg', title: 'Sopranos 1'
        // });
        // this.images.push({
        //     source: 'assets/demo/images/sopranos/sopranos2.jpg',
        //     thumbnail: 'assets/demo/images/sopranos/sopranos2_small.jpg', title: 'Sopranos 2'
        // });
        // this.images.push({
        //     source: 'assets/demo/images/sopranos/sopranos3.jpg',
        //     thumbnail: 'assets/demo/images/sopranos/sopranos3_small.jpg', title: 'Sopranos 3'
        // });
        // this.images.push({
        //     source: 'assets/demo/images/sopranos/sopranos4.jpg',
        //     thumbnail: 'assets/demo/images/sopranos/sopranos4_small.jpg', title: 'Sopranos 4'
        // });
    }

        getsetting(){
            this.display=false 
            const apiUrl = this.api.baseUrl;
            const token = localStorage.getItem('token');
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
            const credentials = {
                organization_id:this.selectedOrganization.organization_id
            };
            this.spiner=true;
            this.http.post(apiUrl+'/client/settings/client_screen_settings',credentials , { headers }).subscribe(
                (response:any) => {
                    console.log(response.data);
                    if(response.data[0]?.id_view_organization){
                        this.spiner=false;
                        this.editMode=true;
                        const editData=response.data[0];
                        console.log(editData);
                        
                        this.formGroup.patchValue({
                            id_view_organization:editData.id_view_organization,
                            gv_energy_used: editData.gv_energy_used=="Y"?true:false,
                            gv_voltage:editData.gv_voltage=="Y"?true:false,
                            gv_current:editData.gv_current=="Y"?true:false,
                            gv_power:editData.gv_power=="Y"?true:false,
                            mn_device_management:editData.mn_device_management=="Y"?true:false,
                            mn_user_management:editData.mn_user_management=="Y"?true:false,
                            en_tab_device_info:editData.en_tab_device_info=="Y"?true:false,
                            en_tab_create_alert:editData.en_tab_create_alert=="Y"?true:false,
                            en_tab_scheduling:editData.en_tab_scheduling=="Y"?true:false,
                            en_tab_report_analysi:editData.en_tab_report_analysis=="Y"?true:false
                        })
                    }
                    else{
                        this.spiner=false;
                        this.editMode=false;
                        this.formGroup.patchValue({
                            id_view_organization:0,
                            gv_energy_used:false,
                            gv_voltage:false,
                            gv_current:false,
                            gv_power:false,
                            mn_device_management:false,
                            mn_user_management:false,
                            en_tab_device_info:false,
                            en_tab_create_alert:false,
                            en_tab_scheduling:false,
                            en_tab_report_analysi:false
                        })
                    }
                    debugger
                },
                (error) => { 
                    this.spiner=false;
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
        getOrg(){
            const apiUrl = this.api.baseUrl;
              const token = localStorage.getItem('token');
              const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
              const credentials = {
                client_id:this.client_id
              };
              this.spiner=true;
              this.http.post(apiUrl+'/client/manage_organization/list', credentials,{ headers }).subscribe(
                  (response) => {
                    this.spiner=false;
                    console.log(response);
                    const res:any=response
                    this.orgList=res.data 
                    debugger
                  },
                  (error) => { 
                    this.spiner=false;
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
            setOrg(i:any){
                this.selectedOrganization=null
                console.log(i);
                this.selectedOrganization=i
                // this.getuser();
            }
            valueChange(){
                if(this.selectedOrganization){
                    const apiUrl = this.api.baseUrl;
                    const token = localStorage.getItem('token');
                    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
                    const credentials = {
                      "id_view_organization": this.editMode?this.ct.id_view_organization.value:0,
                      "user_type": "U",
                      "organization_id": this.selectedOrganization.organization_id,
                      "gv_energy_used": this.ct.gv_energy_used.value?"Y":"N",
                      "gv_voltage":  this.ct.gv_voltage.value?"Y":"N",
                      "gv_current":  this.ct.gv_current.value?"Y":"N",
                      "gv_power":  this.ct.gv_power.value?"Y":"N",
                      "mn_add_organization":  "N",
                      "mn_device_management":  this.ct.mn_device_management.value?"Y":"N",
                      "mn_user_management":  this.ct.mn_user_management.value?"Y":"N",
                      "en_tab_device_info":  this.ct.en_tab_device_info.value?"Y":"N",
                      "en_tab_create_alert":  this.ct.en_tab_create_alert.value?"Y":"N",
                      "en_tab_scheduling":  this.ct.en_tab_scheduling.value?"Y":"N",
                      "en_tab_report_analysi":  this.ct.en_tab_report_analysi.value?"Y":"N"
                    };
                    this.spiner=true;
                    this.http.post(apiUrl+'/client/settings/client_screen_settings_edit',credentials , { headers }).subscribe(
                        (response:any) => {
                          console.log(response);
                          if(response.status=="success"){
                                this.spiner=false;
                              this.messageService.add({ severity: 'success', summary: 'Successful', detail: '.Screen settings Updated.', life: 3000 });
                          }
                          else{
                            this.spiner=false;
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Unknown Error', life: 3000 });
                          }
                          debugger
                        },
                        (error) => { 
                    if(error.status=='401'){
                        this.spiner=false;
                        this.router.navigate(['/']);
                        debugger
                     }
                    console.log(error.status);
                          console.error(error);
                          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'From Server Side!!', life: 3000 });
                        }
                        
                      );
                }
                else{
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'To begin, please choose an organization.', life: 3000 });
                }
                debugger
            }
            
    // confirm1() {
    //     this.confirmationService.confirm({
    //         key: 'confirm1',
    //         message: 'Are you sure to perform this action?'
    //     });
    // }

    // confirm2(event: Event) {
    //     this.confirmationService.confirm({
    //         key: 'confirm2',
    //         target: event.target || new EventTarget,
    //         message: 'Are you sure that you want to proceed?',
    //         icon: 'pi pi-exclamation-triangle',
    //         accept: () => {
    //             this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
    //         },
    //         reject: () => {
    //             this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
    //         }
    //     });
    // }

    // formatCurrency(value: number) {
    //     return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    // }
    
}
