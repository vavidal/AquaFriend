import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService, Usuario, ApiResponse } from './users.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usuarios: UsuarioService,
    private auth: AuthService
  ) {}

  form!: FormGroup;
  idEdit: number | null = null;
  isEdit = false;
  title = 'Creación de Nuevo Usuario';
  processing = false;

  roles: string[] = ['Administrador', 'Editor', 'Viewer'];

  get actionLabel() { return this.isEdit ? 'Guardar Cambios' : 'Guardar'; }
  get f() { return this.form.controls as any; }

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      telefono: [''],
      password: ['']
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!idParam;

    if (this.isEdit) {
      this.idEdit = Number(idParam);
      this.title = 'Editar Usuario';
      this.usuarios.obtenerPorId(this.idEdit).subscribe((u: Usuario) => {
        this.form.patchValue({
          nombre: u.nombre,
          apellido: u.apellido,
          email: u.email,
          role: u.role,
          telefono: (u as any).telefono ?? ''
        });
        this.form.get('password')?.clearValidators();
        this.form.get('password')?.updateValueAndValidity();
      });
    } else {
      this.form.get('password')?.addValidators(Validators.required);
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  submit(): void {
    if (this.form.invalid || this.processing) return;
    this.processing = true;

    const payload: any = this.form.value;
    if (this.isEdit) delete payload.password;

    const goList = () => {
      this.processing = false;
      this.router.navigate(['/dashboard/user/lista']);
    };

    if (this.isEdit && this.idEdit) {
      this.usuarios.actualizar(this.idEdit, payload as Partial<Usuario>).subscribe((resp: ApiResponse<Usuario>) => {
        if (resp?.success) {
          const curr = this.auth.currentUserValue;
          const updated = resp.data as any;
          const editedId = Number(updated?.id_usuario ?? updated?.id ?? this.idEdit);
          const loggedId = Number(curr?.id);

          if (curr && editedId === loggedId) {
            this.auth.updateCurrentUserPartial({
              nombre: updated?.nombre,
              apellido: updated?.apellido,
              email: updated?.email,
              role: (updated?.role as any) ?? curr.role
            });
            this.auth.refreshCurrentUser().subscribe({ next: () => goList(), error: () => goList() });
            return;
          }

          goList();
        } else {
          this.processing = false;
        }
      });
    } else {
      this.usuarios.crear(payload as Usuario).subscribe((resp: ApiResponse<Usuario>) => {
        if (resp?.success) {
          goList();
        } else {
          this.processing = false;
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/dashboard/user/lista']);
  }
}
