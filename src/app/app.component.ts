import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AutoLogOutService } from './services/auto-logout';

import ENLanguage from "../assets/i18n/en.json";
import ESLanguage from "../assets/i18n/es.json";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'velzon';

  constructor(
    public autologout : AutoLogOutService,
    public router: Router,
    private translate: TranslateService
  ) {
    if( localStorage.getItem('activeLanguage') == 'es' ) {
      translate.setTranslation('es', ESLanguage);
      translate.setDefaultLang('es');
    } else {
      translate.setTranslation('en', ENLanguage);
      translate.setDefaultLang('en');
    }

    let userInfo = JSON.parse(localStorage.getItem("userInfo") || '{}');
    if( userInfo.portal != 'admin' ) localStorage.clear();

    this.router.events
    .pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    )
    .subscribe(event => {
      if( this.router.url != '/auth/login' ) {
        setTimeout(() => {
          this.autologout.AutoLogout();
        }, 5000);
      }
    });
  }
}
