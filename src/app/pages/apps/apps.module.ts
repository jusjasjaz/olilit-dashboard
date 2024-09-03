import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbTooltipModule, NgbDropdownModule, NgbAccordionModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

// Feather Icon
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';

// Calendar package
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
// Flat Picker
import { FlatpickrModule } from 'angularx-flatpickr';
// Simplebar
import { SimplebarAngularModule } from 'simplebar-angular';
// Ck Editer
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
// Counter
import { CountToModule } from 'angular-count-to';
// Apex Chart Package
import { NgApexchartsModule } from 'ng-apexcharts';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

// Component Pages
import { AppsRoutingModule } from "./apps-routing.module";
import { SharedModule } from '../../shared/shared.module';
import { CalendarComponent } from './calendar/calendar.component';
import { ChatComponent } from './chat/chat.component';
import { MailboxComponent } from './mailbox/mailbox.component';
import { WidgetsComponent } from './widgets/widgets.component';
import { EmailBasicComponent } from './email/email-basic/email-basic.component';
import { EmailEcommerceComponent } from './email/email-ecommerce/email-ecommerce.component';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { createTranslateLoader } from '../pages.module';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [
    CalendarComponent,
    ChatComponent,
    MailboxComponent,
    WidgetsComponent,
    EmailBasicComponent,
    EmailEcommerceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbAccordionModule,
    NgbProgressbarModule,
    FeatherModule.pick(allIcons),
    FullCalendarModule,
    FlatpickrModule.forRoot(),
    SimplebarAngularModule,
    CKEditorModule,
    CountToModule,
    NgApexchartsModule,
    LeafletModule,
    AppsRoutingModule,
    SharedModule,
    TranslateModule.forChild({
      defaultLanguage: (localStorage.getItem('activeLanguage') ? localStorage.getItem('activeLanguage')! : 'en'),
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ]
})
export class AppsModule { }
