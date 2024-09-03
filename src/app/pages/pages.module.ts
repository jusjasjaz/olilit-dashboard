import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  NgbToastModule, NgbProgressbarModule, NgbNavModule, NgbPaginationModule
} from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CountToModule } from 'angular-count-to';
import { NgApexchartsModule } from 'ng-apexcharts';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule } from 'simplebar-angular';

import { NgSelectModule } from '@ng-select/ng-select';

// Swiper Slider
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

import { LightboxModule } from 'ngx-lightbox';

// Load Icons
import { defineLordIconElement } from 'lord-icon-element';
import lottie from 'lottie-web';

// Pages Routing
import { PagesRoutingModule } from "./pages-routing.module";
import { SharedModule } from "../shared/shared.module";
import { WidgetModule } from '../shared/widget/widget.module';
import { DashboardComponent } from './dashboards/dashboard/dashboard.component';
import { ToastsContainer } from './dashboards/dashboard/toasts-container.component';
import { DashboardsModule } from "./dashboards/dashboards.module";
import { AppsModule } from "./apps/apps.module";
import { EcommerceModule } from "./ecommerce/ecommerce.module";
import { CustomersPageComponent } from './customers-page/customers-page.component';
import { CustomersDetailsPageComponent } from './customers-details-page/customers-details-page.component';
import { MerchantsPageComponent } from './merchants-page/merchants-page.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { UmAddRolesComponent } from './um-add-roles/um-add-roles.component';
import { MerchantRegistrationComponent } from './merchant-registration/merchant-registration.component';
import { MerchantDetailsComponent } from './merchant-details/merchant-details.component';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FeeConfigComponent } from './configuration/fee/fee.component';
import { HelpTicketsComponent } from './help-tickets/help-tickets.component';
import { LimitConfigComponent } from './configuration/limit/limit.component';
import { NotificationComponent } from './notification/notification.component';
import { ServiceProviderConfigComponent } from './service-provider-config/service-provider-config.component';
import { PartnerListComponent } from './partner-list/partner-list.component';
import { ReferralsPageComponent } from './referrals-page/referrals-page.component';
import { QrcodePageComponent } from './qrcode-page/qrcode-page.component';
import { SuccessfulReferralComponent } from './configuration/successful-referral/successful-referral.component';
import { ReportsComponent } from './reports/reports.component';
export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

@NgModule({
  declarations: [
    DashboardComponent,
    ToastsContainer,
    CustomersDetailsPageComponent,
    MerchantsPageComponent,
    UserManagementComponent,
    UmAddRolesComponent,
    MerchantRegistrationComponent,
    MerchantDetailsComponent,
    FeeConfigComponent,
    HelpTicketsComponent,
    LimitConfigComponent,
    NotificationComponent,
    ServiceProviderConfigComponent,
    CustomersPageComponent,
    PartnerListComponent,
    ReferralsPageComponent,
    QrcodePageComponent,
    SuccessfulReferralComponent, 
    ReportsComponent
  ],
  imports: [
    CommonModule,
    NgbToastModule,
    NgbProgressbarModule,
    FlatpickrModule.forRoot(),
    CountToModule,
    NgApexchartsModule,
    LeafletModule,
    SimplebarAngularModule,
    PagesRoutingModule,
    SharedModule,
    WidgetModule,
    NgbNavModule,
    SwiperModule,
    LightboxModule,
    DashboardsModule,
    AppsModule,
    EcommerceModule,
    FormsModule, 
    ReactiveFormsModule,
    NgbPaginationModule,
    NgSelectModule,
    NgbDropdownModule,
    TranslateModule
  ],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class PagesModule { 
  constructor() {
    defineLordIconElement(lottie.loadAnimation);
  }
}
