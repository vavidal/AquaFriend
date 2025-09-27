import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { MainComponent } from './components/main/main';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, Footer, MainComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('AquaFriend');
}
