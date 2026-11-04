import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormularioLaboratorio } from './formulario-laboratorio';

describe('FormularioLaboratorio', () => {
  let component: FormularioLaboratorio;
  let fixture: ComponentFixture<FormularioLaboratorio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioLaboratorio],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioLaboratorio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
