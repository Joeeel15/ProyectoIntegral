import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleLaboratorio } from './detalle-laboratorio';

describe('DetalleLaboratorio', () => {
  let component: DetalleLaboratorio;
  let fixture: ComponentFixture<DetalleLaboratorio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleLaboratorio],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleLaboratorio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
