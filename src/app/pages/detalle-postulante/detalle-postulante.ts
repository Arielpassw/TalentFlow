
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonButton,
  IonSpinner,
  IonChip,
  IonIcon
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  personOutline,
  briefcaseOutline,
  schoolOutline,
  callOutline,
  mailOutline,
  calendarOutline,
  cashOutline,
  checkmarkCircleOutline,
  closeCircleOutline
} from 'ionicons/icons';

import { FirebaseService, registro } from '../../services/firebase.service';

@Component({
  selector: 'app-detalle-postulante',
  standalone: true,
  templateUrl: './detalle-postulante.html',
  styleUrls: ['./detalle-postulante.css'],
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonButton,
    IonSpinner,
    IonChip,
    IonIcon
  ]
})
export class DetallePostulanteComponent implements OnInit {

  private firebase = inject(FirebaseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  postulante: (registro & { id: string }) | null = null;

  cargando = true;
  mensajeError = '';

  constructor() {
    addIcons({
      personOutline,
      briefcaseOutline,
      schoolOutline,
      callOutline,
      mailOutline,
      calendarOutline,
      cashOutline,
      checkmarkCircleOutline,
      closeCircleOutline
    });
  }

  async ngOnInit() {
    await this.cargarDetalle();
  }

  async cargarDetalle() {
    this.cargando = true;
    this.mensajeError = '';

    try {
      const id = this.route.snapshot.paramMap.get('id');

      if (!id) {
        this.mensajeError = 'No se proporcionó el identificador de la postulación.';
        return;
      }

      const registros = await this.firebase.obtenerRegistros();

      this.postulante = registros.find(registro => registro.id === id) ?? null;

      if (!this.postulante) {
        this.mensajeError = 'No se encontró la postulación solicitada.';
      }

    } catch (error) {
      console.error('Error al consultar el postulante:', error);
      this.mensajeError = 'No se pudo obtener la información de Firestore.';
    } finally {
      this.cargando = false;
    }
  }

  regresar() {
    this.router.navigate(['/home']);
  }
}
