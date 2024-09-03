import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LayoutsModule} from "./layouts/layouts.module";
import { PagesModule } from "./pages/pages.module";

import { NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

// Auth
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { initFirebaseBackend } from './authUtils';
import { FakeBackendInterceptor } from './core/helpers/fake-backend';
import { ErrorInterceptor } from './core/helpers/error.interceptor';
import { JwtInterceptor } from './core/helpers/jwt.interceptor';

// Language
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { UserService } from './services/user';

import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { CustomerService } from './services/customer';
import { MerchantService } from './services/merchant';
import { PentestService } from './services/pentest';
import { accessService } from './services/permissions';
import { AutoLogOutService } from './services/auto-logout';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { FeeConfigService } from './services/fee-config';
import { HelpTicketsService } from './services/help-tickets';

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

if (environment.defaultauth === 'firebase') {
  initFirebaseBackend(environment.firebaseConfig);
} else {
  FakeBackendInterceptor;
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    NgProgressModule.withConfig({
      thick: true,
      spinner: false,
      color: '#0190fe',
    }),
    NgProgressHttpModule,
    TranslateModule.forRoot({
      defaultLanguage: localStorage.getItem('activeLanguage') ? localStorage.getItem('activeLanguage')! : 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    LayoutsModule,
    PagesModule,
    NgbModule,
    NgbDropdownModule,
    NgIdleKeepaliveModule
  ],
  providers: [
    UserService,
    CustomerService,
    MerchantService,
    PentestService,
    accessService,
    AutoLogOutService,
    FeeConfigService,
    HelpTicketsService,
    // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
