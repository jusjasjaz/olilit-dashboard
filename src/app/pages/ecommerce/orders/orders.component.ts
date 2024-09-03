import {Component, QueryList, ViewChildren} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {Observable} from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

// Sweet Alert
import Swal from 'sweetalert2';

import {OrdersModel} from './orders.model';
import { Orders } from './data';
import { OrdersService } from './orders.service';
import { NgbdOrdersSortableHeader, SortEvent } from './orders-sortable.directive';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  providers: [OrdersService, DecimalPipe]
})

/**
 * Orders Component
 */
export class OrdersComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  ordersForm!: FormGroup;
  submitted = false;
  CustomersData!: OrdersModel[];
  masterSelected!:boolean;
  checkedList:any;

  // Table data
  ordersList$!: Observable<OrdersModel[]>;
  total$: Observable<number>;
  @ViewChildren(NgbdOrdersSortableHeader) headers!: QueryList<NgbdOrdersSortableHeader>;

  constructor(private modalService: NgbModal,public service: OrdersService, private formBuilder: FormBuilder) {
    // this.ordersList$ = service.countries$;
    this.total$ = service.total$;
  }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Ecommerce' },
      { label: 'Orders', active: true }
    ];

    /**
     * Form Validation
     */
    this.ordersForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      productname: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      payment: ['', [Validators.required]],
      delivered: ['', [Validators.required]]
    });

    /**
     * fetches data
     */
     this._fetchData();
  }

  /**
 * User grid data fetches
 */
   private _fetchData() {
    this.CustomersData = Orders;
  }

   /**
   * Confirmation mail model
   */
    confirm() {
      Swal.fire({
        title: 'You are about to delete a order ?',
        text: 'Deleting your order will remove all of your information from our database.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f46a6a',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Close'
      }).then(result => {
        if (result.value) {
          Swal.fire('Deleted!', 'Mail has been deleted.', 'success');
        }
      });
    }

  /**
   * Open modal
   * @param content modal content
   */
   openModal(content: any) {
    this.submitted = false;
    this.modalService.open(content, { size: 'md', centered: true });
  }

   /**
   * Form data get
   */
    get form() {
      return this.ordersForm.controls;
    }

   /**
  * Save user
  */
    saveUser() {
      if (this.ordersForm.valid) {
        const id= '#VZ2113';
        const name = this.ordersForm.get('name')?.value;
        const product = this.ordersForm.get('productname')?.value;
        const date = this.ordersForm.get('date')?.value;
        const time = "02:21 AM";
        const amount = this.ordersForm.get('amount')?.value;
        const pmethod = this.ordersForm.get('payment')?.value;
        const status = this.ordersForm.get('delivered')?.value;
        this.CustomersData.push({
          id,
          name,
          product,
          date,
          time,
          amount,
          pmethod,
          status
        });
        this.modalService.dismissAll()
      }
      this.submitted = true
    }

  // The master checkbox will check/ uncheck all items
  checkUncheckAll() {
    for (var i = 0; i < this.CustomersData.length; i++) {
      this.CustomersData[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  // Get List of Checked Items
  getCheckedItemList(){
    this.checkedList = [];
    for (var i = 0; i < this.CustomersData.length; i++) {
      if(this.CustomersData[i].isSelected)
      this.checkedList.push(this.CustomersData[i]);
    }
    this.checkedList = JSON.stringify(this.checkedList);
  }

}
