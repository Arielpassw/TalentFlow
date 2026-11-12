
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonList, IonListHeader,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonDatetime,
  IonRadioGroup,
  IonRadio,
  IonSpinner
} from '@ionic/angular/standalone';

import { FirebaseService, registro } from '../services/firebase.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonList,
    IonListHeader,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonCheckbox,
    IonDatetime,
    IonRadioGroup,
    IonRadio,
    IonSpinner
  ]
})
export class HomePage implements OnInit {

  private firebase = inject(FirebaseService);

  // Datos personales
  nombres = '';
  apellidos = '';
  email = '';
  telefono = '';
  fechaNacimiento = '';

  // Información profesional
  cargoPostulado = '';
  nivelAcademico = '';
  experienciaLaboral: number | null = null;
  modalidadTrabajo = '';
  habilidadesTecnicas: string[] = [];
  fechaDisponible_inicio = '';
  aspiracionSalarial: number | null = null;
  resumenProfesional = '';
  consentimientoDatos = false;

  // Información de la aplicación
  postulantes: (registro & { id: string })[] = [];
  postulanteSeleccionado: (registro & { id: string }) | null = null;

  guardando = false;
  cargando = false;
  mensaje = '';
  tipoMensaje: 'exito' | 'error' = 'exito';

  hoy = this.obtenerFechaActual();

  ngOnInit() {
    this.cargarPostulantes();
  }

  private router = inject(Router);

  private obtenerFechaActual(): string {
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }

  private convertirFecha(fecha: string): string {
    return fecha ? fecha.split('T')[0] : '';
  }

  cambiarHabilidad(habilidad: string, seleccionada: boolean) {
    if (seleccionada && !this.habilidadesTecnicas.includes(habilidad)) {
      this.habilidadesTecnicas = [...this.habilidadesTecnicas, habilidad];
    } else if (!seleccionada) {
      this.habilidadesTecnicas = this.habilidadesTecnicas.filter(
        item => item !== habilidad
      );
    }
  }

  async guardar() {
    const nombresValidos = this.nombres.trim().length >= 3;
    const apellidosValidos = this.apellidos.trim().length >= 3;
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim());
    const telefonoValido = /^\d{7,15}$/.test(this.telefono.replace(/\D/g, ''));

    const nacimiento = this.convertirFecha(this.fechaNacimiento);
    const disponibilidad = this.convertirFecha(this.fechaDisponible_inicio);

    const fechaNacimientoValida =
      !!nacimiento && nacimiento <= this.hoy;

    const fechaDisponibilidadValida =
      !!disponibilidad && disponibilidad >= this.hoy;

    const experienciaValida =
      this.experienciaLaboral !== null &&
      Number.isInteger(Number(this.experienciaLaboral)) &&
      this.experienciaLaboral >= 0 &&
      this.experienciaLaboral <= 50;

    const salarioValido =
      this.aspiracionSalarial !== null &&
      Number.isFinite(Number(this.aspiracionSalarial)) &&
      this.aspiracionSalarial > 0;

    if (!nombresValidos || !apellidosValidos) {
      this.mostrarMensaje('Los nombres y apellidos deben tener al menos 3 caracteres.');
      return;
    }

    if (!correoValido) {
      this.mostrarMensaje('Ingrese un correo electrónico válido.');
      return;
    }

    if (!telefonoValido) {
      this.mostrarMensaje('El teléfono debe contener entre 7 y 15 dígitos.');
      return;
    }

    if (!fechaNacimientoValida) {
      this.mostrarMensaje('Ingrese una fecha de nacimiento válida y no futura.');
      return;
    }

    if (!this.cargoPostulado || !this.nivelAcademico) {
      this.mostrarMensaje('Seleccione el cargo y el nivel académico.');
      return;
    }

    if (!experienciaValida) {
      this.mostrarMensaje('La experiencia debe ser un número entero entre 0 y 50 años.');
      return;
    }

    if (!this.modalidadTrabajo) {
      this.mostrarMensaje('Seleccione una modalidad de trabajo.');
      return;
    }

    if (this.habilidadesTecnicas.length === 0) {
      this.mostrarMensaje('Seleccione al menos una habilidad técnica.');
      return;
    }

    if (!fechaDisponibilidadValida) {
      this.mostrarMensaje('La fecha disponible no puede ser anterior a hoy.');
      return;
    }

    if (!salarioValido) {
      this.mostrarMensaje('La aspiración salarial debe ser mayor que cero.');
      return;
    }

    if (this.resumenProfesional.trim().length < 30) {
      this.mostrarMensaje('El resumen profesional debe tener al menos 30 caracteres.');
      return;
    }

    if (!this.consentimientoDatos) {
      this.mostrarMensaje('Debe aceptar el tratamiento de sus datos personales.');
      return;
    }

    this.guardando = true;
    this.mensaje = '';

    try {
      const nuevoRegistro: registro = {
        nombres: this.nombres.trim(),
        apellidos: this.apellidos.trim(),
        email: this.email.trim(),
        telefono: this.telefono.trim(),
        fechaNacimiento: nacimiento,
        cargoPostulado: this.cargoPostulado,
        nivelAcademico: this.nivelAcademico,
        experienciaLaboral: Number(this.experienciaLaboral),
        modalidadTrabajo: this.modalidadTrabajo,
        habilidadesTecnicas: [...this.habilidadesTecnicas],
        fechaDisponible_inicio: disponibilidad,
        aspiracionSalarial: Number(this.aspiracionSalarial),
        resumenProfesional: this.resumenProfesional.trim(),
        consentimientoDatos: this.consentimientoDatos
      };

      await this.firebase.guardarRegistro(nuevoRegistro);

      this.limpiarFormulario();
      await this.cargarPostulantes();

      this.mostrarMensaje('Postulante registrado correctamente.', 'exito');

    } catch (error) {
      console.error('Error al guardar el postulante:', error);
      this.mostrarMensaje('No se pudo guardar el registro. Revise Firebase y sus reglas.');
    } finally {
      this.guardando = false;
    }
  }

  async cargarPostulantes() {
    this.cargando = true;

    try {
      this.postulantes = await this.firebase.obtenerRegistros();
    } catch (error) {
      console.error('Error al consultar postulantes:', error);
      this.mostrarMensaje('No se pudieron consultar los registros de Firebase.');
    } finally {
      this.cargando = false;
    }
  }

  verDetalle(postulante: registro & { id: string }) {
    this.router.navigate(['/detalle-postulante', postulante.id]);
  }

  cerrarDetalle() {
    this.postulanteSeleccionado = null;
  }

  private mostrarMensaje(
    mensaje: string,
    tipo: 'exito' | 'error' = 'error'
  ) {
    this.mensaje = mensaje;
    this.tipoMensaje = tipo;
  }

  limpiarFormulario() {
    this.nombres = '';
    this.apellidos = '';
    this.email = '';
    this.telefono = '';
    this.fechaNacimiento = '';
    this.cargoPostulado = '';
    this.nivelAcademico = '';
    this.experienciaLaboral = null;
    this.modalidadTrabajo = '';
    this.habilidadesTecnicas = [];
    this.fechaDisponible_inicio = '';
    this.aspiracionSalarial = null;
    this.resumenProfesional = '';
    this.consentimientoDatos = false;
  }
}
