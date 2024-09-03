import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeeConfigComponent } from "./fee.component";

const routes: Routes = [

  {
    path: "fee-configuration",
    component: FeeConfigComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeeConfigRoutingModule { }
