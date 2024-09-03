import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersPageComponent } from './customers-page/customers-page.component';
import { MerchantsPageComponent } from './merchants-page/merchants-page.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { UmAddRolesComponent } from './um-add-roles/um-add-roles.component';
import { MerchantDetailsComponent } from './merchant-details/merchant-details.component';
import { MerchantRegistrationComponent } from './merchant-registration/merchant-registration.component';
import { CustomersDetailsPageComponent } from './customers-details-page/customers-details-page.component';
// Component pages
import { DashboardComponent } from "./dashboards/dashboard/dashboard.component";
import { FeeConfigComponent } from './configuration/fee/fee.component';
import { HelpTicketsComponent } from './help-tickets/help-tickets.component';
import { LimitConfigComponent } from './configuration/limit/limit.component';
import { NotificationComponent } from './notification/notification.component';
import { ServiceProviderConfigComponent } from './service-provider-config/service-provider-config.component';
import { PartnerListComponent } from './partner-list/partner-list.component';
import { ReferralsPageComponent } from './referrals-page/referrals-page.component';
import { SuccessfulReferralComponent } from './configuration/successful-referral/successful-referral.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  {
        path: "",
        component: DashboardComponent
  },
  {
        path: "dashboard",
        component: DashboardComponent
    },
    {
      path: "customers-page",
      component: CustomersPageComponent
    },
    {
      path: "customers-details-page/:id",
      component: CustomersDetailsPageComponent
      
    },
    {
      path: "merchants-page",
      component: MerchantsPageComponent
    },
    {
      path: "user-management",
      component: UserManagementComponent
    },
    {
      path: "merchant-details/:id",
      component: MerchantDetailsComponent
    },
    {
      path: "merchant-registration",
      component: MerchantRegistrationComponent
    },
    {
      path: "um-add-roles",
      component: UmAddRolesComponent
    },
    {
      path: "limit-configuration",
      component: LimitConfigComponent
    },
    {
      path: "fee-configuration",
      component: FeeConfigComponent
    },
    {
      path: "successful-referral-configuration",
      component: SuccessfulReferralComponent
    },
    {
      path: "help-tickets",
      component: HelpTicketsComponent
    },
    {
      path: "notification-template",
      component: NotificationComponent
    },
    {
      path: "service-provider-config",
      component: ServiceProviderConfigComponent
    },
    {
      path: "partner-list",
      component: PartnerListComponent
    },
    {
      path: "referral-list/:id",
      component: ReferralsPageComponent
    },
    {
      path: "reports",
      component: ReportsComponent
    },
    {
      path: '', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule)
    },
    {
      path: 'apps', loadChildren: () => import('./apps/apps.module').then(m => m.AppsModule)
    },
    {
      path: 'ecommerce', loadChildren: () => import('./ecommerce/ecommerce.module').then(m => m.EcommerceModule)
    },
    {
      path: 'projects', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule)
    },
    {
      path: 'tasks', loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule)
    },
    {
      path: 'crm', loadChildren: () => import('./crm/crm.module').then(m => m.CrmModule)
    },
    {
      path: 'crypto', loadChildren: () => import('./crypto/crypto.module').then(m => m.CryptoModule)
    },
    {
      path: 'invoices', loadChildren: () => import('./invoices/invoices.module').then(m => m.InvoicesModule)
    },
    {
      path: 'tickets', loadChildren: () => import('./tickets/tickets.module').then(m => m.TicketsModule)
    },
    {
      path: 'pages', loadChildren: () => import('./extrapages/extraspages.module').then(m => m.ExtraspagesModule)
    },
    { path: 'ui', loadChildren: () => import('./ui/ui.module').then(m => m.UiModule) },
    {
      path: 'advance-ui', loadChildren: () => import('./advance-ui/advance-ui.module').then(m => m.AdvanceUiModule)
    },
    {
      path: 'forms', loadChildren: () => import('./form/form.module').then(m => m.FormModule)
    },
    {
      path: 'tables', loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule)
    },
    {
      path: 'charts', loadChildren: () => import('./charts/charts.module').then(m => m.ChartsModule)
    },
    {
      path: 'icons', loadChildren: () => import('./icons/icons.module').then(m => m.IconsModule)
    },
    {
      path: 'maps', loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule)
    },
    {
      path: 'marletplace', loadChildren: () => import('./nft-marketplace/nft-marketplace.module').then(m => m.NftMarketplaceModule)
    },
    {
      path: 'customers-page', loadChildren: () => import('./customers-page/customers-page.module').then(m => m.CustomersPageModule)
    },
    {
      path: 'merchants-page', loadChildren: () => import('./merchants-page/merchants-page.module').then(m => m.MerchantsPageModule)
    },
    {
      path: 'limit-configuration', loadChildren: () => import('./configuration/limit/limit.module').then(m => m.LimitConfigPageModule)
    },
    {
      path: 'fee-configuration', loadChildren: () => import('./configuration/fee/fee.module').then(m => m.FeeConfigPageModule)
    },
    {
      path: 'help-tickets', loadChildren: () => import('./help-tickets/help-tickets.module').then(m => m.HelpTicketsPageModule)
    },
    {
      path: 'notification-template', loadChildren: () => import('./notification/notification.module').then(m => m.NotificationPageModule)
    },
    {
      path: 'service-provider-config', loadChildren: () => import('./service-provider-config/service-provider-config.module').then(m => m.ServiceProviderConfigPageModule)
    },
    {
      path: 'partner-list', loadChildren: () => import('./partner-list/partner-list.module').then(m => m.PartnerListModule)
    },
    {
      path: 'referral-list/:id', loadChildren: () => import('./referrals-page/referrals-page.module').then(m => m.ReferralsPageModule)
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
