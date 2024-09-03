import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient): any {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
  }
  
@NgModule({
  declarations: [

  ],
  imports: [
    TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
        }
      }),
  ],
  exports: [TranslateModule]
})
export class TransLangModule { }
