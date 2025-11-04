
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService, Usuario, ApiResponse, Role } from './users.service';
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
  showPass = false;
  roles: Role[] = [];

  get actionLabel() { return this.isEdit ? 'Guardar Cambios' : 'Guardar'; }
  get f() { return this.form.controls as any; }

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role_id: [null, Validators.required],
      password: ['']
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!idParam;

    this.usuarios.obtenerRoles().subscribe((list: Role[]) => {
      this.roles = (list ?? []).filter(r => (r.nombre || '').toLowerCase() === 'administrador');
      if (this.roles.length === 0) this.roles = [{ id_role: 1, nombre: 'Administrador' }];
      if (!this.form.get('role_id')?.value) this.form.get('role_id')?.setValue(this.roles[0].id_role);
    });

    if (this.isEdit) {
      this.idEdit = Number(idParam);
      this.title = 'Editar Usuario';
      this.usuarios.obtenerPorId(this.idEdit).subscribe((u: Usuario) => {
        this.form.patchValue({
          nombre: u.nombre,
          apellido: u.apellido,
          email: u.email,
          role_id: u.role_id ?? 1
        });
        this.form.get('password')?.clearValidators();
        this.form.get('password')?.updateValueAndValidity();
      });
    } else {
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  submit(): void {
    if (this.form.invalid || this.processing) return;
    this.processing = true;

    const goList = () => {
      this.processing = false;
      this.router.navigate(['/dashboard/user']);
    };

    if (this.isEdit && this.idEdit) {
      const payload: any = { ...this.form.value };
      if (!payload.password) delete payload.password;
      this.usuarios.actualizar(this.idEdit, payload as Partial<Usuario>).subscribe((resp: ApiResponse<Usuario>) => {
        if (resp?.success) {
          const curr = this.auth.currentUserValue;
          const updated: any = resp.data;
          const editedId = Number(updated?.id_usuario ?? this.idEdit);
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
      const payload = {
        nombre: this.form.value.nombre,
        apellido: this.form.value.apellido,
        email: this.form.value.email,
        password: this.form.value.password,
        role_id: this.form.value.role_id,
        activo: 1
      } as any;
      this.usuarios.crear(payload as Usuario).subscribe((resp: ApiResponse<Usuario>) => {
        if (resp?.success) goList();
        else this.processing = false;
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/dashboard/user']);
  }
}
