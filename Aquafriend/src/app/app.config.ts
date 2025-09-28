// src/app/app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

// 👇 IMPORTA withFetch
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    // 👇 usa fetch para HttpClient (mejor para SSR/Vite)
    provideHttpClient(withFetch()),
    importProvidersFrom(ReactiveFormsModule),
  ],
};
