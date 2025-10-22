import { Component, OnInit, Input, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-drawer-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './drawer-menu.html',
  styleUrls: ['./drawer-menu.scss']
})
export class DrawerMenuComponent implements OnInit {
  @Input() isMobile = false;
  user: { nombre?: string; apellido?: string; role?: string } | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const raw = window.localStorage.getItem('admin_user');
      this.user = raw ? JSON.parse(raw) : null;
    }
  }

  handleClick(): void {}
}
