import { Component, OnInit, EventEmitter, Output, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { EventService } from '../../core/services/event.service';

//Logout
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../core/services/authfake.service';
import { Router } from '@angular/router';

// Language
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from '../../core/services/language.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  element: any;
  mode: string | undefined;
  @Output() mobileMenuButtonClicked = new EventEmitter();

  flagvalue: any;
  valueset: any;
  countryName: any;
  cookieValue: any;
  userInfo:any=[];
  active_language: any = '';

  envTag: any = environment.tag;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private eventService: EventService, 
    public languageService: LanguageService,
    public _cookiesService: CookieService, 
    public translate: TranslateService, 
    private authService: AuthenticationService, 
    private authFackservice: AuthfakeauthenticationService, 
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.element = document.documentElement;
    this.userInfo = JSON.parse(localStorage.getItem("userInfo") || '{}');
    this.active_language = localStorage.getItem('activeLanguage') ? localStorage.getItem('activeLanguage') : 'en';
    this.translate.use(this.active_language);
  }

  setLang(type:any) {
    window.location.reload();
    this.translate.use(type);
    localStorage.setItem('activeLanguage', type);
    this.active_language = type;
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
     toggleMobileMenu(event: any) {
      event.preventDefault();
      this.mobileMenuButtonClicked.emit();
    }

  /**
   * Logout the user
   */
   logout() {
    if (environment.defaultauth === 'firebase') {
      this.authService.logout();
    } else {
      this.authFackservice.logout();
    }
    this.router.navigate(['/auth/login']);
  }

}
