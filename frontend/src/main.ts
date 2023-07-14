import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import {en_US, NZ_I18N} from "ng-zorro-antd/i18n";

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    { provide: NZ_I18N, useValue: en_US }
  ]
}).catch(err => console.error(err));
