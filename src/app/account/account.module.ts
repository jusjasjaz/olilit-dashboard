import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Load Icons
import { defineLordIconElement } from 'lord-icon-element';
import lottie from 'lottie-web';

import { AccountRoutingModule } from './account-routing.module';
import { SigninModule } from "./auth/signin/signin.module";
import { SignupModule } from "./auth/signup/signup.module";
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { RegisterMerchantComponent } from './auth/register-merchant/register-merchant.component';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SignupComponent } from './signup/signup.component';
import { SignUpStepOneComponent } from './signup-completion/sign-up-step-one/sign-up-step-one.component';
import { SignUpStepTwoComponent } from './signup-completion/sign-up-step-two/sign-up-step-two.component';
import { SignUpStepThreeComponent } from './signup-completion/sign-up-step-three/sign-up-step-three.component';
import { NgSelectModule } from '@ng-select/ng-select';
export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    RegisterMerchantComponent,
    SignupComponent,
    SignUpStepOneComponent,
    SignUpStepTwoComponent,
    SignUpStepThreeComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AccountRoutingModule,
    SigninModule,
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AccountModule { 
  constructor() {
    defineLordIconElement(lottie.loadAnimation);
  }
}
