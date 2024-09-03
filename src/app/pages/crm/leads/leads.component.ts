import {Component, QueryList, ViewChildren} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {Observable} from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

// Sweet Alert
import Swal from 'sweetalert2';

import { LeadsModel } from './leads.model';
import { Leads } from './data';
import { LeadsService } from './leads.service';
import { NgbdLeadsSortableHeader, SortEvent } from './leads-sortable.directive';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss'],
  providers: [LeadsService, DecimalPipe]
})
/**
 * Leads Component
 */
export class LeadsComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  submitted = false;
  leadsForm!: FormGroup;
  CustomersData!: LeadsModel[];
  masterSelected!:boolean;
  checkedList:any;

  // Table data
  invoiceList$!: Observable<LeadsModel[]>;
  total$: Observable<number>;
  @ViewChildren(NgbdLeadsSortableHeader) headers!: QueryList<NgbdLeadsSortableHeader>;

  constructor(private modalService: NgbModal,public service: LeadsService, private formBuilder: FormBuilder) {
    this.invoiceList$ = service.countries$;
    this.total$ = service.total$;
  }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'CRM' },
      { label: 'Leads', active: true }
    ];

    /**
     * Form Validation
     */
     this.leadsForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      company: ['', [Validators.required]],
      score: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      location: ['', [Validators.required]]
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
    this.CustomersData = Leads;
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
    return this.leadsForm.controls;
  }

  /**
  * Save user
  */
   saveUser() {
    if (this.leadsForm.valid) {
      const name = this.leadsForm.get('name')?.value;
      const company = this.leadsForm.get('company')?.value;
      const score = this.leadsForm.get('score')?.value;
      const phone = this.leadsForm.get('phone')?.value;
      const location = this.leadsForm.get('location')?.value;
      const date = "20 Sep, 2021";
      const tags = this.leadsForm.get('tags')?.value;
      const profile = "assets/images/users/avatar-10.jpg";
      this.CustomersData.push({
        profile,
        name,
        company,
        score,
        phone,
        location,
        date,
        tags
      });
      this.modalService.dismissAll()
    }
    this.submitted = true
  }

  /**
   * Confirmation mail model
   */
   confirm() {
    Swal.fire({
      title: 'You are about to delete a lead ?',
      text: 'Deleting your lead will remove all of your information from our database.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Close'
    }).then(result => {
      if (result.value) {
        Swal.fire('Deleted!', 'Leads has been deleted.', 'success');
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
  * Multiple Default Select2
  */
   selectValue = ['Lead', 'Partner', 'Exiting', 'Long-term'];

}
