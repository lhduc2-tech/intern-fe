import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import {
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { routes } from './app.routes';
import { AuthRepository } from './features/auth/domain/auth.repository';
import { AuthApiService } from './features/auth/data/auth-api.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    { provide: AuthRepository, useClass: AuthApiService },
  ],
};
