import {Component, QueryList, ViewChildren} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {Observable} from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

// Sweet Alert
import Swal from 'sweetalert2';

import { ContactsModel } from './contacts.model';
import { Contacts } from './data';
import { ContactsService } from './contacts.service';
import { NgbdContactsSortableHeader, SortEvent } from './contacts-sortable.directive';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  providers: [ContactsService, DecimalPipe]
})

/**
 * Contacts Component
 */
export class ContactsComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  submitted = false;
  contactsForm!: FormGroup;
  CustomersData!: ContactsModel[];
  masterSelected!:boolean;
  checkedList:any;

  // Table data
  contactsList$!: Observable<ContactsModel[]>;
  total$: Observable<number>;
  @ViewChildren(NgbdContactsSortableHeader) headers!: QueryList<NgbdContactsSortableHeader>;

  constructor(private modalService: NgbModal,public service: ContactsService, private formBuilder: FormBuilder) {
    this.contactsList$ = service.countries$;
    this.total$ = service.total$;
  }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'CRM' },
      { label: 'Contacts', active: true }
    ];

    /**
     * Form Validation
     */
     this.contactsForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      company_name: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      lead_score: ['', [Validators.required]],
      tags: ['', [Validators.required]]
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
    this.CustomersData = Contacts;
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
    return this.contactsForm.controls;
  }

  /**
  * Save user
  */
   saveUser() {
    if (this.contactsForm.valid) {
      const name = this.contactsForm.get('name')?.value;
      const company = this.contactsForm.get('company_name')?.value;
      const email = this.contactsForm.get('email')?.value;
      const phone = this.contactsForm.get('phone')?.value;
      const score = this.contactsForm.get('lead_score')?.value;
      const date = "20 Sep, 2021";
      const time = "07:55AM";
      const tags = this.contactsForm.get('tags')?.value;
      const profile = "assets/images/users/avatar-10.jpg";
      this.CustomersData.push({
        profile,
        name,
        company,
        email,
        phone,
        score,
        date,
        time,
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
      title: 'You are about to delete a contact ?',
      text: 'Deleting your contact will remove all of your information from our database.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Close'
    }).then(result => {
      if (result.value) {
        Swal.fire('Deleted!', 'contact has been deleted.', 'success');
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
