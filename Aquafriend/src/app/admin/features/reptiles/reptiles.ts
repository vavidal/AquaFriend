import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { filter } from 'rxjs/operators';

type RegistroReptil = {
  id: number;
  especie: string;
  habitat?: string;
  alimentacion?: string;
  tamano_promedio?: string;
  descripcion?: string;
  imagen_referencial?: string;
  fecha_registro?: string | Date;
};

@Component({
  selector: 'app-reptiles',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './reptiles.html',
  styleUrls: ['./reptiles.scss'],
})
export class ReptilesComponent {
  private router = inject(Router);
  private http = inject(HttpClient);

  cargando = signal(false);
  reptiles = signal<RegistroReptil[]>([]);
  private readonly apiUrl = 'http://localhost:3000/api/reptiles';

  constructor() {
    this.cargar();
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => this.cargar());
  }

  cargar() {
    this.cargando.set(true);
    this.http.get<RegistroReptil[]>(this.apiUrl).subscribe({
      next: rows => { this.reptiles.set(rows); this.cargando.set(false); },
      error: () => { this.reptiles.set([]); this.cargando.set(false); }
    });
  }

  img(p: RegistroReptil) {
    return p.imagen_referencial || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="88" height="88"><rect width="100%" height="100%" fill="%23e5edf4"/></svg>';
  }

  onOpenFilters() {}
  goCreate() { this.router.navigate(['/dashboard/reptiles/crear']); }
  goEdit(id: number) { this.router.navigate(['/dashboard/reptiles/editar', id]); }

  descargarExcel() {
    const rows = this.reptiles();
    if (!rows.length) {
      alert('No hay datos para exportar.');
      return;
    }
    const escapeCell = (value?: string | number | null) =>
      value === undefined || value === null ? '' : String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const header = ['Especie', 'Descripción', 'Hábitat', 'Alimentación', 'Tamaño', 'Registro'];
    const thead = `<tr>${header.map(h => `<th>${h}</th>`).join('')}</tr>`;
    const tbody = rows.map(p => {
      const fecha = p.fecha_registro ? new Date(p.fecha_registro).toLocaleDateString('es-CL') : '';
      return `<tr>
        <td>${escapeCell(p.especie)}</td>
        <td>${escapeCell(p.descripcion)}</td>
        <td>${escapeCell(p.habitat)}</td>
        <td>${escapeCell(p.alimentacion)}</td>
        <td>${escapeCell(p.tamano_promedio)}</td>
        <td>${escapeCell(fecha)}</td>
      </tr>`;
    }).join('');

    const table = `<table><thead>${thead}</thead><tbody>${tbody}</tbody></table>`;
    const blob = new Blob(['\ufeff' + table], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reptiles_${new Date().toISOString().split('T')[0]}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  onDelete(p: RegistroReptil) {
    const ok = confirm(`¿Eliminar "${p.especie}"? Esta acción no se puede deshacer.`);
    if (!ok) return;
    this.http.delete(`${this.apiUrl}/${p.id}`, { observe: 'response' }).subscribe({
      next: () => this.cargar(),
      error: (err) => {
        const status = err?.status;
        const msg = err?.error?.message || err?.message || 'Error desconocido';
        console.error('Error al eliminar reptil', status, msg, err);
        alert(`No se pudo eliminar el reptil. [${status}] ${msg}`);
      }
    });
  }
}
