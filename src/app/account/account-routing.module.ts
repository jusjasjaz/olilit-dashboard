import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component Pages
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { RegisterMerchantComponent } from './auth/register-merchant/register-merchant.component';
import { SignupComponent } from './signup/signup.component';
import { SignUpStepOneComponent } from './signup-completion/sign-up-step-one/sign-up-step-one.component';
import { SignUpStepTwoComponent } from './signup-completion/sign-up-step-two/sign-up-step-two.component';
import { SignUpStepThreeComponent } from './signup-completion/sign-up-step-three/sign-up-step-three.component';
import { SignUpStepFourComponent } from './signup-completion/sign-up-step-four/sign-up-step-four.component';
import { SignUpStepFiveComponent } from './signup-completion/sign-up-step-five/sign-up-step-five.component';
import { SignUpStepSixComponent } from './signup-completion/sign-up-step-six/sign-up-step-six.component';
import { SignUpStepSuccessComponent } from './signup-completion/sign-up-step-success/sign-up-step-success.component';

const routes: Routes = [
  {
    path: 'signin', loadChildren: () => import('./auth/signin/signin.module').then(m => m.SigninModule)
  },
  {
    path: 'signup', loadChildren: () => import('./auth/signup/signup.module').then(m => m.SignupModule)
  },
  {
    path: 'pass-reset', loadChildren: () => import('./auth/pass-reset/pass-reset.module').then(m => m.PassResetModule)
  },
  {
    path: 'pass-create', loadChildren: () => import('./auth/pass-create/pass-create.module').then(m => m.PassCreateModule)
  },
  {
    path: 'lockscreen', loadChildren: () => import('./auth/lockscreen/lockscreen.module').then(m => m.LockscreenModule)
  },
  {
    path: 'logout', loadChildren: () => import('./auth/logout/logout.module').then(m => m.LogoutModule)
  },
  {
    path: 'success-msg', loadChildren: () => import('./auth/success-msg/success-msg.module').then(m => m.SuccessMsgModule)
  },
  {
    path: 'twostep', loadChildren: () => import('./auth/twostep/twostep.module').then(m => m.TwostepModule)
  },
  {
    path: 'errors', loadChildren: () => import('./auth/errors/errors.module').then(m => m.ErrorsModule)
  },
  {
    path: "register-merchant",
    component: RegisterMerchantComponent
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "sign-up",
    component: SignupComponent
  },
  {
    path: "sign-up-completion-step-one",
    component: SignUpStepOneComponent
  },
  {
    path: "sign-up-completion-step-two",
    component: SignUpStepTwoComponent,
  },
  {
    path: "sign-up-completion-step-three",
    component: SignUpStepThreeComponent,
  },
  {
    path: "sign-up-completion-step-four",
    component: SignUpStepFourComponent
  },
  {
    path: "sign-up-completion-step-five",
    component: SignUpStepFiveComponent,
  },
  {
    path: "sign-up-completion-step-six",
    component: SignUpStepSixComponent,
  },
  {
    path: "sign-up-completion-success",
    component: SignUpStepSuccessComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
