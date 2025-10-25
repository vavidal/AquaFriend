import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateUserComponent {
  form!: FormGroup;
  roles = ['Administrador', 'Operador', 'Invitado'];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      role: ['Administrador', [Validators.required]]
    });
  }

  get f() { return this.form.controls as any; }

  cancelar() { history.back(); }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    console.log('payload', this.form.value);
    // TODO: this.usersService.create(this.form.value).subscribe(...)
  }
}
