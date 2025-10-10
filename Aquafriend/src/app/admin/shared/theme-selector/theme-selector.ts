import { Component, inject } from '@angular/core';
import { ThemeManager } from '../../services/theme-manager';
import { MaterialModule } from '../../ui/material-module';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-theme-selector',
  imports: [MaterialModule, TitleCasePipe],
  templateUrl: './theme-selector.html',
  styleUrl: './theme-selector.scss'
})
export class ThemeSelector {
  protected themeService = inject(ThemeManager);

}
