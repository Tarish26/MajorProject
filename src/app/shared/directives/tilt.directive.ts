import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTilt]',
  standalone: true
})
export class TiltDirective {
  @Input() tiltMax = 10;
  
  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform 0.1s ease-out, box-shadow 0.1s ease-out');
    this.renderer.setStyle(this.el.nativeElement, 'transform-style', 'preserve-3d');
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const el = this.el.nativeElement;
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const xPct = x / rect.width - 0.5;
    const yPct = y / rect.height - 0.5;
    
    const rotateX = yPct * -this.tiltMax * 2;
    const rotateY = xPct * this.tiltMax * 2;

    this.renderer.setStyle(el, 'transform', `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s cubic-bezier(0.25, 1, 0.5, 1)');
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)');
    
    // Reset transition speed after reset animation completes
    setTimeout(() => {
      this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform 0.1s ease-out, box-shadow 0.1s ease-out');
    }, 500);
  }
}
