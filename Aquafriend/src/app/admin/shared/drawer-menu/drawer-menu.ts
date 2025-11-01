import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-drawer-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './drawer-menu.html',
  styleUrls: ['./drawer-menu.scss']
})
export class DrawerMenuComponent {
  @Input() isMobile = false;
  private auth = inject(AuthService);
  user$ = this.auth.currentUser$;

  private fullName = (u: any): string => {
    const n1 = [u?.nombre, u?.apellido].filter(Boolean).join(' ').trim();
    const n2 = u?.nombre_completo ?? u?.full_name ?? u?.name ?? '';
    return (n1 || n2 || u?.email || '').trim();
  };

  displayName$ = this.user$.pipe(map(u => u ? this.fullName(u) : ''));
  role$ = this.user$.pipe(map(u => (u?.role ?? '').toString()));
  handleClick(): void {}
}
