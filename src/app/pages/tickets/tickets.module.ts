import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTypeaheadModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// Counter
import { CountToModule } from 'angular-count-to';
// Flat Picker
import { FlatpickrModule } from 'angularx-flatpickr';
// Simple Bar
import { SimplebarAngularModule } from 'simplebar-angular';

// Component pages
import { TicketsRoutingModule } from './tickets-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';

@NgModule({
  declarations: [
    ListComponent,
    DetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbDropdownModule,
    NgbTooltipModule,
    CountToModule,
    FlatpickrModule,
    SimplebarAngularModule,
    TicketsRoutingModule,
    SharedModule
  ]
})
export class TicketsModule { }
