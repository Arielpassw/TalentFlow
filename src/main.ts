
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';

import { AppComponent } from './app/app.component';
import { HomePage } from './app/home/home.page';
import { DetallePostulanteComponent } from './app/pages/detalle-postulante/detalle-postulante';

bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(),
    provideRouter([
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomePage
      },
      {
        path: 'detalle-postulante/:id',
        component: DetallePostulanteComponent
      }
    ])
  ]
}).catch(console.error);
