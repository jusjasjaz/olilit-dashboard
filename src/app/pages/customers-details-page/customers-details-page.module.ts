import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbDropdownModule, NgbPaginationModule, NgbTypeaheadModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

// FlatPicker
import { FlatpickrModule } from 'angularx-flatpickr';

// Select Droup down
import { NgSelectModule } from '@ng-select/ng-select';

// Component pages
import { CustomersDetailsPageRoutingModule } from './customers-details-page-routing.module';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CustomersDetailsPageRoutingModule,
    CommonModule,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbNavModule,
    FlatpickrModule,
    SharedModule,
    NgSelectModule,
    ReactiveFormsModule,
    NgbNavModule,
    HttpClientModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class CustomersDetailsPageModule { }
