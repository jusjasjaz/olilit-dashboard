import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ServiceProviderConfigComponent } from "./service-provider-config.component";

const routes: Routes = [
  {
    path: "notification-template",
    component: ServiceProviderConfigComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceProviderConfigRoutingModule { }
