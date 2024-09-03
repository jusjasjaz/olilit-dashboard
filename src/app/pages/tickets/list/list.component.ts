import {Component, QueryList, ViewChildren} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {Observable} from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

// Sweet Alert
import Swal from 'sweetalert2';

import {ListModel} from './list.model';
import { Orders } from './data';
import { ListService } from './list.service';
import { NgbdListSortableHeader, SortEvent } from './list-sortable.directive';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [ListService, DecimalPipe]
})

/**
 * List Component
 */
export class ListComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  ordersForm!: FormGroup;
  CustomersData!: ListModel[];
  masterSelected!:boolean;
  checkedList:any;
  submitted = false;

  // Table data
  invoicesList$!: Observable<ListModel[]>;
  total$: Observable<number>;
  @ViewChildren(NgbdListSortableHeader) headers!: QueryList<NgbdListSortableHeader>;


  constructor(private modalService: NgbModal,public service: ListService, private formBuilder: FormBuilder) {
    this.invoicesList$ = service.countries$;
    this.total$ = service.total$;
  }


  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Invoices' },
      { label: 'Invoice List', active: true }
    ];

    /**
     * Form Validation
     */
     this.ordersForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      client: ['', [Validators.required]],
      assigned: ['', [Validators.required]],
      status: ['', [Validators.required]],
      priority: ['', [Validators.required]]
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
          Swal.fire('Deleted!', 'Order has been deleted.', 'success');
        }
      });
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

     /**
   * Open modal
   * @param content modal content
   */
   openModal(content: any) {
    this.submitted = false;
    this.modalService.open(content, { size: 'lg', centered: true });
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
      const ticketId= '#VLZ463';
      const title = this.ordersForm.get('title')?.value;
      const client = this.ordersForm.get('client')?.value;
      const assigned = this.ordersForm.get('assigned')?.value;
      const createDate = "21 Dec, 2021";
      const dueDate = "02 Jan, 2021";
      const status = this.ordersForm.get('status')?.value;
      const statusClass= "info";
      const priority = this.ordersForm.get('priority')?.value;
      const priorityClass = "warning";
      this.CustomersData.push({
        ticketId,
        title,
        client,
        assigned,
        createDate,
        dueDate,
        status,
        statusClass,
        priority,
        priorityClass
      });
      this.modalService.dismissAll()
    }
    this.submitted = true
  }

}
