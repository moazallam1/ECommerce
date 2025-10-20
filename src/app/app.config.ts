import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import {
  provideRouter,
  withHashLocation,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';

import {
  HttpClient,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideToastr } from 'ngx-toastr';
import { provideSweetAlert2 } from '@sweetalert2/ngx-sweetalert2';
import { headerInterceptor } from './Core/Interceptors/Headers/header.interceptor';
import { NgxSpinnerModule } from "ngx-spinner";
import { errorsInterceptor } from './Core/Interceptors/Errors/errors.interceptor';
import { loadingInterceptor } from './Core/Interceptors/Loading/loading.interceptor';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from './Core/Utilities/httpLoadFiles';

export const appConfig: ApplicationConfig = {
  providers: [
    provideSweetAlert2({
      // Optional configuration
      fireOnInit: false,
      dismissOnDestroy: true,
    }),
    provideToastr(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withViewTransitions(),
      withHashLocation(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top' })
    ),
    BrowserAnimationsModule,
    provideAnimations(),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([headerInterceptor,errorsInterceptor,loadingInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,},}), 
        importProvidersFrom(NgxSpinnerModule,TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        }))
  ],
};
