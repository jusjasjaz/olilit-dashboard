import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule, NgbDropdownModule, NgbAccordionModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// Swiper Slider
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
// Select Droup down
import { NgSelectModule } from '@ng-select/ng-select';
// Flatpicker
import { FlatpickrModule } from 'angularx-flatpickr';

// Component pages
import { ExtraPagesRoutingModule } from './extrapages-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { StarterComponent } from './starter/starter.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { SettingsComponent } from './profile/settings/settings.component';
import { TeamComponent } from './team/team.component';
import { TimelineComponent } from './timeline/timeline.component';
import { FaqsComponent } from './faqs/faqs.component';
import { PricingComponent } from './pricing/pricing.component';
import { GalleryComponent } from './gallery/gallery.component';
import { SitemapComponent } from './sitemap/sitemap.component';
import { SearchResultsComponent } from './search-results/search-results.component';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

@NgModule({
  declarations: [
    StarterComponent,
    ProfileComponent,
    SettingsComponent,
    TeamComponent,
    TimelineComponent,
    FaqsComponent,
    PricingComponent,
    GalleryComponent,
    SitemapComponent,
    SearchResultsComponent
  ],
  imports: [
    CommonModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbAccordionModule,
    NgbTooltipModule,
    SwiperModule,
    NgSelectModule,
    FlatpickrModule,
    ExtraPagesRoutingModule,
    SharedModule
  ],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }
  ]
})
export class ExtraspagesModule { }
