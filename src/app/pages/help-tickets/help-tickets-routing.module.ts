import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HelpTicketsComponent } from "./help-tickets.component";

const routes: Routes = [

  {
    path: "help-tickets",
    component: HelpTicketsComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpTicketsRoutingModule { }
