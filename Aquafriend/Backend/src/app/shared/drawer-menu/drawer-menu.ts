import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-drawer-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatDividerModule, MatListModule],
  templateUrl: './drawer-menu.html',
  styleUrls: ['./drawer-menu.scss']
})
export class DrawerMenuComponent {
  @Input() isMobile = false;
  @Input() userName = 'John David';
  @Input() avatarUrl: string | null = null;

  @Output() itemClicked = new EventEmitter<void>();

  handleClick() {
    if (this.isMobile) this.itemClicked.emit();
  }
}
