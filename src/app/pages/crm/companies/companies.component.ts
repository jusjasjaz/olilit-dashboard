import {Component, QueryList, ViewChildren} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {Observable} from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

// Sweet Alert
import Swal from 'sweetalert2';

import { CompaniesModel } from './companies.model';
import { Companies } from './data';
import { CompaniesService } from './companies.service';
import { NgbdCompaniesSortableHeader, SortEvent } from './companies-sortable.directive';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
  providers: [CompaniesService, DecimalPipe]
})

/**
 * Companies Component
 */
export class CompaniesComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  submitted = false;
  companiesForm!: FormGroup;
  CustomersData!: CompaniesModel[];
  masterSelected!:boolean;
  checkedList:any;

  // Table data
  companiesList$!: Observable<CompaniesModel[]>;
  total$: Observable<number>;
  @ViewChildren(NgbdCompaniesSortableHeader) headers!: QueryList<NgbdCompaniesSortableHeader>;

  constructor(private modalService: NgbModal,public service: CompaniesService, private formBuilder: FormBuilder) {
    this.companiesList$ = service.countries$;
    this.total$ = service.total$;
  }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'CRM' },
      { label: 'Companies', active: true }
    ];

    /**
     * Form Validation
     */
     this.companiesForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      owner: ['', [Validators.required]],
      industryType: ['', [Validators.required]],
      rating: ['', [Validators.required]],
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
      this.CustomersData = Companies;
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
    return this.companiesForm.controls;
  }

  /**
  * Save user
  */
   saveUser() {
    if (this.companiesForm.valid) {
      const img = 'assets/images/brands/dribbble.png';
      const companyName = this.companiesForm.get('name')?.value;
      const owner = this.companiesForm.get('owner')?.value;
      const industryType = this.companiesForm.get('industryType')?.value;
      const rating = this.companiesForm.get('rating')?.value;
      const location = this.companiesForm.get('location')?.value;
      this.CustomersData.push({
        img,
        companyName,
        owner,
        industryType,
        rating,
        location
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
      title: 'You are about to delete a company ?',
      text: 'Deleting your company will remove all of your information from our database.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Close'
    }).then(result => {
      if (result.value) {
        Swal.fire('Deleted!', 'company has been deleted.', 'success');
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

}
