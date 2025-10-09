import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { DrawerMenuComponent } from '../drawer-menu/drawer-menu';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatTooltipModule,
    MatSidenavModule,
    DrawerMenuComponent,
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard {
  @ViewChild('drawer') drawer?: MatDrawer;
  userName = 'John David';

  isMobile(): boolean { return typeof window !== 'undefined' && window.innerWidth < 960; }
  onNavigate(): void { if (this.isMobile()) this.drawer?.close(); }
}
