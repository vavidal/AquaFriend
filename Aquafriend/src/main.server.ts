import 'zone.js/node'; // ← requerido por Angular Universal/SSR

import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

export default function bootstrap(context: BootstrapContext) {
  return bootstrapApplication(App, config, context);
}
