import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LimitConfigComponent } from "./limit.component";

const routes: Routes = [

  {
    path: "limit-configuration",
    component: LimitConfigComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LimitConfigRoutingModule { }
