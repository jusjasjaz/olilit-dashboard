import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbPaginationModule, NgbTypeaheadModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

// FlatPicker
import { FlatpickrModule } from 'angularx-flatpickr';

// Select Droup down
import { NgSelectModule } from '@ng-select/ng-select';

// Component pages
import { SharedModule } from '../../shared/shared.module';

import { MerchantsPageRoutingModule } from './merchants-page-routing.module';
import { MerchantsPageComponent } from './merchants-page.component';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    MerchantsPageRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbNavModule,
    FlatpickrModule,
    SharedModule,
    NgSelectModule
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class MerchantsPageModule { }
