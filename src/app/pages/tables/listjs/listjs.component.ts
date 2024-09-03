import {Component, QueryList, ViewChildren} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {Observable} from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

// Sweet Alert
import Swal from 'sweetalert2';

import {ListJsModel} from './listjs.model';
import { ListJs } from './data';
import { OrdersService } from './listjs.service';
import { NgbdOrdersSortableHeader, SortEvent } from './listjs-sortable.directive';

@Component({
  selector: 'app-listjs',
  templateUrl: './listjs.component.html',
  styleUrls: ['./listjs.component.scss'],
  providers: [OrdersService, DecimalPipe]

})

/**
 * Listjs table Component
 */
export class ListjsComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  submitted = false;
  listJsForm!: FormGroup;
  ListJsData!: ListJsModel[];
  checkedList:any;
  masterSelected!:boolean;

  // Table data
  ListJsList$!: Observable<ListJsModel[]>;
  total$: Observable<number>;
  @ViewChildren(NgbdOrdersSortableHeader) headers!: QueryList<NgbdOrdersSortableHeader>;

  constructor(private modalService: NgbModal,public service: OrdersService, private formBuilder: FormBuilder) {
    this.ListJsList$ = service.countries$;
    this.total$ = service.total$;
  }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Tables' },
      { label: 'Listjs', active: true }
    ];

    /**
     * Form Validation
     */
     this.listJsForm = this.formBuilder.group({
      customer_name: ['', [Validators.required]],
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
    this.ListJsData = ListJs;
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
    return this.listJsForm.controls;
  }

  /**
  * Save saveListJs
  */
   saveListJs() {
    if (this.listJsForm.valid) {
      const id = this.listJsForm.get('id')?.value;
      const customer_fname = this.listJsForm.get('customer_name')?.value;
      const customer_lname = this.listJsForm.get('customer_lname')?.value;
      const email = this.listJsForm.get('email')?.value;
      const phone = this.listJsForm.get('phone')?.value;
      const date = '14 Apr, 2021';
      const status_color = "success";
      const status = this.listJsForm.get('status')?.value;
      this.ListJsData.push({
        id,
        customer_fname,
        customer_lname,
        email,
        phone,
        date,
        status_color,
        status
      });
      this.modalService.dismissAll()
    }
    this.submitted = true
  }

  // The master checkbox will check/ uncheck all items
  checkUncheckAll() {
    for (var i = 0; i < this.ListJsData.length; i++) {
      this.ListJsData[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  // Get List of Checked Items
  getCheckedItemList(){
    this.checkedList = [];
    for (var i = 0; i < this.ListJsData.length; i++) {
      if(this.ListJsData[i].isSelected)
      this.checkedList.push(this.ListJsData[i]);
    }
    this.checkedList = JSON.stringify(this.checkedList);
  }

   /**
   * Confirmation mail model
   */
    confirm() {
      Swal.fire({
        title: 'Are you Sure ?',
        text: 'Are you Sure You want to Remove this Record ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f46a6a',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Close'
      }).then(result => {
        if (result.value) {
          Swal.fire('Deleted!', 'ListJs has been deleted.', 'success');
        }
      });
    }

}
