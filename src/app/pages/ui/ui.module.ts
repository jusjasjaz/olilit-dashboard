import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  NgbAlertModule, NgbCarouselModule, NgbDropdownModule, NgbModalModule, NgbProgressbarModule,
  NgbTooltipModule, NgbPopoverModule, NgbPaginationModule, NgbNavModule, NgbAccordionModule,
  NgbCollapseModule, NgbToastModule
} from '@ng-bootstrap/ng-bootstrap';

// Load Icons
import { defineLordIconElement } from 'lord-icon-element';
import lottie from 'lottie-web';

import { SimplebarAngularModule } from 'simplebar-angular';

import { UiRoutingModule } from './ui-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { AlertsComponent } from './alerts/alerts.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { BadgesComponent } from './badges/badges.component';
import { ColorsComponent } from './colors/colors.component';
import { CardsComponent } from './cards/cards.component';
import { CarouselComponent } from './carousel/carousel.component';
import { DropdownsComponent } from './dropdowns/dropdowns.component';
import { GridComponent } from './grid/grid.component';
import { ImagesComponent } from './images/images.component';
import { TabsComponent } from './tabs/tabs.component';
import { AccordionsComponent } from './accordions/accordions.component';
import { ModalsComponent } from './modals/modals.component';
import { PlaceholderComponent } from './placeholder/placeholder.component';
import { ProgressComponent } from './progress/progress.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { MediaComponent } from './media/media.component';
import { VideoComponent } from './video/video.component';
import { TypographyComponent } from './typography/typography.component';
import { ListComponent } from './list/list.component';
import { GeneralComponent } from './general/general.component';
import { RibbonsComponent } from './ribbons/ribbons.component';
import { UtilitiesComponent } from './utilities/utilities.component';
import { ToastsContainer } from './notifications/toasts-container.component';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [AlertsComponent, ButtonsComponent, BadgesComponent, ColorsComponent, CardsComponent, CarouselComponent, DropdownsComponent, GridComponent, ImagesComponent, TabsComponent, AccordionsComponent, ModalsComponent, PlaceholderComponent, ProgressComponent, NotificationsComponent, MediaComponent, VideoComponent, TypographyComponent, ListComponent, GeneralComponent, RibbonsComponent, UtilitiesComponent,
    ToastsContainer
    ],
  imports: [
    CommonModule,
    UiRoutingModule,
    SharedModule,
    FormsModule,
    NgbAlertModule,
    NgbCarouselModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    NgbPopoverModule,
    NgbPaginationModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbCollapseModule,
    NgbToastModule,
    SimplebarAngularModule,
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
export class UiModule { 
  constructor() {
    defineLordIconElement(lottie.loadAnimation);
  }
}
