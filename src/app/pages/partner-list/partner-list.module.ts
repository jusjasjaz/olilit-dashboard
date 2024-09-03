import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartnerListRoutingModule } from './partner-list-routing.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbPaginationModule, NgbTypeaheadModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    PartnerListRoutingModule,
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
export class PartnerListModule { }
