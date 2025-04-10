// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// import { AppModule } from './app/app.module';

// platformBrowserDynamic()
//   .bootstrapModule(AppModule)
//   .catch((err) => console.error(err));


import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Load runtime config before starting the app
fetch('/assets/config.json')
  .then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to load config.json: ${res.statusText}`);
    }
    return res.json();
  })
  .then((config) => {
    // Assign values to the environment object
    environment.videoSDKApiKey = config.videoSDKApiKey;
    environment.videoSDKSecretKey = config.videoSDKSecretKey;
    environment.googleApiKey = config.googleApiKey;
    environment.geminiApiKey = config.geminiApiKey;

    // Now bootstrap the app
    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .catch((err) => console.error(err));
  })
  .catch((err) => {
    console.error('Error loading configuration:', err);
  });
