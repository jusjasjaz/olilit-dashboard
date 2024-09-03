import {Component, QueryList, ViewChildren} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {Observable} from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import {Country} from './list-view.model';
import { COUNTRIES } from './data';
import { ListViewService } from './list-view.service';
import { NgbdListViewSortableHeader, SortEvent } from './list-view-sortable.directive';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
  providers: [ListViewService, DecimalPipe]
})

/**
 * ListView Component
 */
export class ListViewComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  submitted = false;
  ordersForm!: FormGroup;
  CustomersData!: Country[];
  checkedList:any;
  masterSelected!:boolean;

  // Table data
  listViewList$!: Observable<Country[]>;
  total$: Observable<number>;
  @ViewChildren(NgbdListViewSortableHeader) headers!: QueryList<NgbdListViewSortableHeader>;

  constructor(private modalService: NgbModal,public service: ListViewService, private formBuilder: FormBuilder) {
    this.listViewList$ = service.countries$;
    this.total$ = service.total$;
  }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Tasks' },
      { label: 'Tasks List', active: true }
    ];

    /**
     * Form Validation
     */
     this.ordersForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      title: ['', [Validators.required]],
      createName: ['', [Validators.required]],
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
      this.CustomersData = COUNTRIES;
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
          const taskId= '#VZ2113';
          const project = this.ordersForm.get('name')?.value;
          const task = this.ordersForm.get('title')?.value;
          const creater = this.ordersForm.get('createName')?.value;
          const status = this.ordersForm.get('status')?.value;
          const priority = this.ordersForm.get('priority')?.value;
          const subItem = 'assets/images/users/avatar-5.jpg';
          const dueDate = "25 Jan, 2022";
          const statusClass = "secondary";
          const priorityClass = "danger";
          this.CustomersData.push({
            taskId,
            project,
            task,
            creater,
            dueDate,
            status,
            statusClass,
            priority,
            priorityClass,
            subItem
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
