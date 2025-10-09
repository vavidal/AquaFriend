import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MaterialModule } from '../../ui/material-module';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings-menu',
  imports: [MaterialModule, RouterLink],
  templateUrl: './settings-menu.html',
  styleUrl: './settings-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsMenu {}
