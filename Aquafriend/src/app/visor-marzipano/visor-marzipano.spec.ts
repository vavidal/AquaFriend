import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisorMarzipanoComponent } from './visor-marzipano';

describe('VisorMarzipano', () => {
  let component: VisorMarzipanoComponent;
  let fixture: ComponentFixture<VisorMarzipanoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisorMarzipanoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisorMarzipanoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
