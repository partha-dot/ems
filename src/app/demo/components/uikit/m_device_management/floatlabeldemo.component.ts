import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ViewChild, TemplateRef} from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { Product } from 'src/app/demo/api/product';
import { ApiService } from 'src/app/demo/service/api.service';
import { ProductService } from 'src/app/demo/service/product.service';
import { CrudComponent } from '../../pages/crud/crud.component';
import { Customer } from 'src/app/demo/api/customer';
import { TreeNode } from 'primeng/api';
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

  products!: Product[];

  product!: Product;

  selectedProducts!: Product[] | null;

  submitted: boolean = false;

  statuses!: any[];
  loginType:string=localStorage.getItem('loginType')
  device=[
    {
      "device_id": "AB0000001",
      "model": "ENERGY",
      "battery": "70%",
      "status": "active"
    },
    {
      "device_id": "AB0000002",
      "model": "ENERGY",
      "battery": "60%",
      "status": "deactive"
    },
    {
      "device_id": "AB0000003",
      "model": "ENERGY",
      "battery": "75%",
      "status": "active"
    },
    {
      "device_id": "AB0000004",
      "model": "ENERGY",
      "battery": "80%",
      "status": "deactive"
    },
    {
      "device_id": "AB0000005",
      "model": "ENERGY",
      "battery": "65%",
      "status": "active"
    },
    {
      "device_id": "AB0000006",
      "model": "ENERGY",
      "battery": "50%",
      "status": "deactive"
    },
    {
      "device_id": "AB0000007",
      "model": "ENERGY",
      "battery": "90%",
      "status": "active"
    },
    {
      "device_id": "AB0000008",
      "model": "ENERGY",
      "battery": "45%",
      "status": "deactive"
    },
    {
      "device_id": "AB0000009",
      "model": "ENERGY",
      "battery": "85%",
      "status": "active"
    },
    {
      "device_id": "AB0000010",
      "model": "ENERGY",
      "battery": "55%",
      "status": "deactive"
    },
    {
      "device_id": "AB0000011",
      "model": "ENERGY",
      "battery": "75%",
      "status": "active"
    },
    {
      "device_id": "AB0000012",
      "model": "ENERGY",
      "battery": "40%",
      "status": "deactive"
    },
    {
      "device_id": "AB0000013",
      "model": "ENERGY",
      "battery": "60%",
      "status": "active"
    },
    {
      "device_id": "AB0000014",
      "model": "ENERGY",
      "battery": "95%",
      "status": "deactive"
    },
    {
      "device_id": "AB0000015",
      "model": "ENERGY",
      "battery": "50%",
      "status": "active"
    },
    {
      "device_id": "AB0000016",
      "model": "ENERGY",
      "battery": "75%",
      "status": "deactive"
    },
    {
      "device_id": "AB0000017",
      "model": "ENERGY",
      "battery": "80%",
      "status": "active"
    },
    {
      "device_id": "AB0000018",
      "model": "ENERGY",
      "battery": "65%",
      "status": "deactive"
    },
    {
      "device_id": "AB0000019",
      "model": "ENERGY",
      "battery": "70%",
      "status": "active"
    },
    {
      "device_id": "AB0000020",
      "model": "ENERGY",
      "battery": "85%",
      "status": "deactive"
    }
  ]
  DeviceModel = [
    { name: 'Energy', code: 'EN' },
    { name: 'Water', code: 'WA' },
    { name: 'Power', code: 'PO' },
    { name: 'Wind', code: 'WI' }
];

  constructor(private productService: ProductService, private messageService: MessageService, private confirmationService: ConfirmationService) {}

  ngOnInit() {
      this.productService.getProducts().then((data) => (this.products = data));

      this.statuses = [
          { label: 'INSTOCK', value: 'instock' },
          { label: 'LOWSTOCK', value: 'lowstock' },
          { label: 'OUTOFSTOCK', value: 'outofstock' }
      ];
  }

  openNew() {
      this.product = {};
      this.submitted = false;
      this.productDialog = true;
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
      this.product = { ...product };
      this.productDialog = true;
  }

  deleteProduct() {
    debugger
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Device Deleted', life: 3000 });
      // this.confirmationService.confirm({
      //     message: 'Are you sure you want to delete this Device ?',
      //     header: 'Confirm',
      //     icon: 'pi pi-exclamation-triangle',
      //     accept: () => {
      //         this.products = this.products.filter((val) => val.id !== product.id);
      //         this.product = {};
      //         this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Device Deleted', life: 3000 });
      //     }
      // });
  }

  hideDialog() {
      this.productDialog = false;
      this.submitted = false;
  }

  saveProduct() {
      this.submitted = true;

      if (this.product.name?.trim()) {
          if (this.product.id) {
              this.products[this.findIndexById(this.product.id)] = this.product;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
          } else {
              this.product.id = this.createId();
              this.product.image = 'product-placeholder.svg';
              this.products.push(this.product);
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
          }

          this.products = [...this.products];
          this.productDialog = false;
          this.product = {};
      }
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