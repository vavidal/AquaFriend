import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorMarzipano } from './visor-marzipano';

describe('VisorMarzipano', () => {
  let component: VisorMarzipano;
  let fixture: ComponentFixture<VisorMarzipano>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisorMarzipano]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisorMarzipano);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
