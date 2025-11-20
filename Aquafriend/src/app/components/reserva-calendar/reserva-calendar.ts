import { Component, ElementRef, HostListener, Input, OnDestroy, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

type DayCell = {
  iso: string;
  label: number;
  sameMonth: boolean;
  isPast: boolean;
  busy: boolean;
  selected: boolean;
  available: boolean;
};

type MonthView = {
  label: string;
  weeks: DayCell[][];
};

@Component({
  selector: 'app-reserva-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reserva-calendar.html',
  styleUrls: ['./reserva-calendar.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ReservaCalendarComponent),
    multi: true
  }]
})
export class ReservaCalendarComponent implements ControlValueAccessor, OnDestroy {
  @Input() monthsToShow = 2;

  private busySet = new Set<string>();
  @Input() set busyDates(value: Set<string> | string[] | null | undefined) {
    if (!value) {
      this.busySet = new Set();
    } else if (value instanceof Set) {
      this.busySet = new Set(value);
    } else {
      this.busySet = new Set(value);
    }
    this.buildMonths();
  }

  months: MonthView[] = [];
  private viewDate = startOfMonth(new Date());
  private todayIso = toIsoDate(new Date());

  value: string | null = null;
  panelHeight = 0;
  panelMaxHeight = 0;
  panelStyles: Partial<CSSStyleDeclaration> = {};
  private disabled = false;
  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  open = false;

  constructor(private host: ElementRef<HTMLElement>) {
    this.buildMonths();
  }

  ngOnDestroy(): void {}

  writeValue(value: string | null): void {
    this.value = value;
    this.buildMonths();
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.buildMonths();
  }

  prevMonth(): void {
    const newDate = new Date(this.viewDate);
    newDate.setMonth(newDate.getMonth() - 1);
    const today = new Date();
    if (
      newDate.getFullYear() < today.getFullYear() ||
      (newDate.getFullYear() === today.getFullYear() && newDate.getMonth() < today.getMonth())
    ) {
      return;
    }
    this.viewDate = startOfMonth(newDate);
    this.buildMonths();
  }

  nextMonth(): void {
    const newDate = new Date(this.viewDate);
    newDate.setMonth(newDate.getMonth() + 1);
    this.viewDate = startOfMonth(newDate);
    this.buildMonths();
  }

  isPrevDisabled(): boolean {
    const prev = new Date(this.viewDate);
    prev.setMonth(prev.getMonth() - 1);
    const prevEnd = new Date(prev.getFullYear(), prev.getMonth() + 1, 0);
    return toIsoDate(prevEnd) < this.todayIso;
  }

  select(day: DayCell): void {
    if (this.disabled || day.busy || !day.sameMonth || day.isPast) return;
    this.value = day.iso;
    this.onChange(day.iso);
    this.onTouched();
    this.open = false;
    this.panelStyles = {};
    this.panelMaxHeight = 0;
    this.buildMonths();
    this.updatePanelHeight();
  }

  togglePanel(): void {
    if (this.disabled) return;
    this.open = !this.open;
    if (this.open) {
      setTimeout(() => {
        this.updatePanelHeight();
        this.computePanelPosition();
      });
    } else {
      this.panelStyles = {};
      this.panelMaxHeight = 0;
    }
  }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  onWindowChange(): void {
    if (this.open) {
      this.computePanelPosition();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(ev: MouseEvent): void {
    if (!this.open) return;
    if (!this.host.nativeElement.contains(ev.target as Node)) {
      this.open = false;
      this.panelStyles = {};
    }
  }

  private buildMonths(): void {
    const months: MonthView[] = [];
    let cursor = new Date(this.viewDate);
    for (let i = 0; i < this.monthsToShow; i++) {
      months.push(this.buildMonth(cursor));
      cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    }
    this.months = months;
    this.updatePanelHeight();
  }

  private buildMonth(baseDate: Date): MonthView {
    const first = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
    const start = new Date(first);
    const startWeekDay = start.getDay();
    start.setDate(start.getDate() - startWeekDay);

    const formatter = new Intl.DateTimeFormat('es-CL', { month: 'long', year: 'numeric' });
    const label = formatter.format(first);

    const weeks: DayCell[][] = [];
    let current = new Date(start);
    for (let week = 0; week < 6; week++) {
      const days: DayCell[] = [];
      for (let day = 0; day < 7; day++) {
        const iso = toIsoDate(current);
        const sameMonth = current.getMonth() === baseDate.getMonth();
        const isPast = iso < this.todayIso;
        const busy = this.busySet.has(iso);
        const available = sameMonth && !isPast && !busy;
        days.push({
          iso,
          label: current.getDate(),
          sameMonth,
          isPast,
          busy,
          selected: !!this.value && iso === this.value,
          available
        });
        current.setDate(current.getDate() + 1);
      }
      weeks.push(days);
    }
    return { label, weeks };
  }

  private updatePanelHeight(): void {
    const panel = this.host.nativeElement.querySelector('.calendar');
    this.panelHeight = panel ? panel.clientHeight : 0;
    this.panelMaxHeight = Math.min(this.panelHeight || 360, window.innerHeight - 32);
  }

  private computePanelPosition(): void {
    const rect = this.host.nativeElement.getBoundingClientRect();
    const padding = 16;
    const width = Math.min(
      Math.max(rect.width, 360),
      Math.min(520, window.innerWidth - padding * 2)
    );
    let left = rect.left;
    if (left + width > window.innerWidth - padding) {
      left = Math.max(padding, window.innerWidth - width - padding);
    }

    const height = this.panelMaxHeight || Math.min(420, window.innerHeight - padding * 2);
    const spacing = 8;
    let top = rect.bottom + spacing;
    if (top + height > window.innerHeight - padding) {
      top = rect.top - height - spacing;
      if (top < padding) {
        top = padding;
      }
    }

    this.panelStyles = {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      width: `${width}px`
    };
  }
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
