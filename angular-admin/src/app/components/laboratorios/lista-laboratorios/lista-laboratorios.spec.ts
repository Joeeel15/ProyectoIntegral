import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaLaboratorios } from './lista-laboratorios';

describe('ListaLaboratorios', () => {
  let component: ListaLaboratorios;
  let fixture: ComponentFixture<ListaLaboratorios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaLaboratorios],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaLaboratorios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
