import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbPaginationModule, NgbTypeaheadModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// FlatPicker
import { FlatpickrModule } from 'angularx-flatpickr';

// Select Droup down
import { NgSelectModule } from '@ng-select/ng-select';

// Component pages
import { SharedModule } from '../../shared/shared.module';
import { CustomersPageRoutingModule } from './customers-page-routing.module';
import { CustomersPageComponent } from './customers-page.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    CustomersPageRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbNavModule,
    FlatpickrModule,
    SharedModule,
    NgSelectModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class CustomersPageModule { }
