import {Component, QueryList, ViewChildren} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {Observable} from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

// Sweet Alert
import Swal from 'sweetalert2';

import {customerModel} from './customers.model';
import { Customers } from './data';
import { AdvancedService } from './customers.service';
import { NgbdAdvancedSortableHeader, SortEvent } from './customers-sortable.directive';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  providers: [AdvancedService, DecimalPipe]
})

/**
 * Customers Component
 */
export class CustomersComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  submitted = false;
  customerForm!: FormGroup;
  CustomersData!: customerModel[];
  masterSelected!:boolean;
  checkedList:any;

  // Table data
  invoiceList$!: Observable<customerModel[]>;
  total$: Observable<number>;
  @ViewChildren(NgbdAdvancedSortableHeader) headers!: QueryList<NgbdAdvancedSortableHeader>;

  constructor(private modalService: NgbModal,public service: AdvancedService, private formBuilder: FormBuilder) {
    this.invoiceList$ = service.countries$;
    this.total$ = service.total$;
  }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Ecommerce' },
      { label: 'Customers', active: true }
    ];

     /**
     * Form Validation
     */
      this.customerForm = this.formBuilder.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        status: ['', [Validators.required]]
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
    this.CustomersData = Customers;
  }

  /**
  * Sort table data
  * @param param0 sort the column
  *
  */
   onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

   /**
   * Confirmation mail model
   */
    confirm() {
      Swal.fire({
        title: 'Are you sure ?',
        text: 'Are you sure you want to remove this record ?',
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
    return this.customerForm.controls;
  }

   /**
  * Save user
  */
    saveUser() {
      if (this.customerForm.valid) {
        const name = this.customerForm.get('name')?.value;
        const email = this.customerForm.get('email')?.value;
        const phone = this.customerForm.get('phone')?.value;
        const date = this.customerForm.get('date')?.value;
        const status = this.customerForm.get('status')?.value;
        const statusClass = "success";
        this.CustomersData.push({
          name,
          email,
          phone,
          date,
          status,
          statusClass
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
