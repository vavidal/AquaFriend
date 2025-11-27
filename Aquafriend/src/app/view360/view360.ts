import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TOUR_OPTIONS, TourOption } from './tour-options';

@Component({
  selector: 'app-view360',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './view360.html',
  styleUrls: ['./view360.css']
})
export class View360Component {
  protected readonly tours: TourOption[] = TOUR_OPTIONS;

  trackById = (_: number, item: TourOption) => item.id;

  isCatalog(option: TourOption) {
    return option.type === 'catalog';
  }
}
