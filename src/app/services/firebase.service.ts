
import { Injectable } from '@angular/core';

import {
  initializeApp,
  getApp,
  getApps
} from 'firebase/app';

import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  serverTimestamp
} from 'firebase/firestore';

import { environment } from '../../environments/environment';

export interface registro {
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  cargoPostulado: string;
  nivelAcademico: string;
  experienciaLaboral: number;
  modalidadTrabajo: string;
  habilidadesTecnicas: string[];
  fechaDisponible_inicio: string;
  aspiracionSalarial: number;
  resumenProfesional: string;
  consentimientoDatos: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private app = getApps().length
    ? getApp()
    : initializeApp(environment.firebase);

  // Base de datos: formulario
  private db = getFirestore(this.app);

  // Colección: registro
  private registrosRef = collection(this.db, 'registro');

  async guardarRegistro(datos: registro): Promise<void> {
    await addDoc(this.registrosRef, {
      ...datos,
      creadoEn: serverTimestamp()
    });
  }

  async obtenerRegistros(): Promise<(registro & { id: string })[]> {
    const resultado = await getDocs(this.registrosRef);

    return resultado.docs.map(documento => ({
      id: documento.id,
      ...(documento.data() as registro)
    }));
  }
}
