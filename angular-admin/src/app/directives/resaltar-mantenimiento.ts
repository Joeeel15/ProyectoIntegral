import { Directive, ElementRef, Input, Renderer2, OnChanges } from '@angular/core';

@Directive({
  selector: '[appResaltarMantenimiento]',
  standalone: true
})
export class ResaltarMantenimiento implements OnChanges {

  @Input() appResaltarMantenimiento = '';

  constructor(
    private elemento: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnChanges(): void {
    if (this.appResaltarMantenimiento === 'mantenimiento') {
      this.renderer.setStyle(
        this.elemento.nativeElement,
        'background-color',
        '#fff3cd'
      );

      this.renderer.setStyle(
        this.elemento.nativeElement,
        'border-left',
        '5px solid #ffc107'
      );
    } else {
      this.renderer.removeStyle(
        this.elemento.nativeElement,
        'background-color'
      );

      this.renderer.removeStyle(
        this.elemento.nativeElement,
        'border-left'
      );
    }
  }
}
