import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { PopupComponent } from './app/popup/popup.component';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';

const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule)
  ]
};

bootstrapApplication(PopupComponent, appConfig)
  .catch(err => console.error(err));