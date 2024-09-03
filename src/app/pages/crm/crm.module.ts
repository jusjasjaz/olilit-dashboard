import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTypeaheadModule, NgbTooltipModule, NgbDropdownModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

// Flat Picker
import { FlatpickrModule } from 'angularx-flatpickr';

// Ng Select
import { NgSelectModule } from '@ng-select/ng-select';

// Component pages
import { CRMRoutingModule } from './crm-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ContactsComponent } from './contacts/contacts.component';
import { CompaniesComponent } from './companies/companies.component';
import { DealsComponent } from './deals/deals.component';
import { LeadsComponent } from './leads/leads.component';

@NgModule({
  declarations: [
    ContactsComponent,
    CompaniesComponent,
    DealsComponent,
    LeadsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbAccordionModule,
    FlatpickrModule,
    NgSelectModule,
    CRMRoutingModule,
    SharedModule
  ]
})
export class CrmModule { }
