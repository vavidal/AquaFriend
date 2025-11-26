// src/app/visor-marzipano/visor-marzipano.component.ts

import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { TourOption, TOUR_OPTIONS } from '../view360/tour-options';


declare const Marzipano: any;
declare const APP_DATA: any; 

@Component({
  selector: 'app-visor-marzipano',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor],
  templateUrl: './visor-marzipano.html',
  styleUrls: ['./visor-marzipano.css']
})
export class VisorMarzipanoComponent implements OnInit, OnDestroy {
  private viewer: any;
  private tourName: string | null = null;
  protected currentTour?: TourOption;
  protected readonly tours = TOUR_OPTIONS;

  constructor(private route: ActivatedRoute, private el: ElementRef) {}

  ngOnInit(): void {
  
    this.route.paramMap.subscribe(params => {
      this.tourName = params.get('tourName');
      this.currentTour = this.tours.find(t => t.id === this.tourName);
      if (this.tourName) {
        // Ejecutar la carga del tour
        setTimeout(() => this.loadTour(), 10); 
      }
    });
  }

  loadTour(): void {
    // Verificación de carga de la librería
    if (typeof Marzipano === 'undefined' || typeof APP_DATA === 'undefined' || !this.tourName) {
      console.error("Marzipano o APP_DATA no están disponibles.");
      return;
    }

    // Limpiar el visor anterior si se navega entre tours
    if (this.viewer) {
      this.viewer.destroy();
    }

    const viewerElement = this.el.nativeElement.querySelector('#marzipano-viewer');
    if (!viewerElement) return;

    this.viewer = new Marzipano.Viewer(viewerElement);

    // 🚩 Buscar la escena por el ID usando el APP_DATA cargado por data.js
    const sceneData = APP_DATA.scenes.find((s: any) => s.id === this.tourName);

    if (!sceneData) {
      console.error(`ERROR: No se encontró la escena con el ID: ${this.tourName}.`);
      return;
    }

    // Configuración de la fuente de las imágenes
    const source = Marzipano.ImageUrlSource.fromString(
      '/assets/tour360/tiles/' + sceneData.id + '/{z}/{f}/{y}/{x}.jpg',
      { cubeMap: sceneData.faceSize }
    );

    // Configuración de geometría y vista
    const geometry = new Marzipano.CubeGeometry(sceneData.levels);
    const limiter = Marzipano.RectilinearView.limit.traditional(
      sceneData.faceSize,
      100 * Math.PI / 180
    );
    const view = new Marzipano.RectilinearView(sceneData.initialViewParameters, limiter);

    // Crear la escena y activarla
    const scene = this.viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true
    });

    scene.switchTo({ transitionDuration: 1000 });
  }

  ngOnDestroy(): void {
    if (this.viewer) {
      this.viewer.destroy();
    }
  }
}
