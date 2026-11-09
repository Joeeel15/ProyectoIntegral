import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleMedico } from './detalle-medico';

describe('DetalleMedico', () => {
  let component: DetalleMedico;
  let fixture: ComponentFixture<DetalleMedico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleMedico],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleMedico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});