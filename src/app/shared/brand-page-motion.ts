import { Directive, ElementRef, HostListener, NgZone, OnDestroy, afterNextRender, inject } from '@angular/core';

@Directive()
export class BrandPageMotion implements OnDestroy {
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly zone = inject(NgZone);
  private observer?: IntersectionObserver;
  private frames = new Set<number>();
  private counted = new WeakSet<HTMLElement>();
  private pressed?: HTMLElement;
  private pressTimer?: ReturnType<typeof setTimeout>;
  constructor() {
    afterNextRender(() => this.zone.runOutsideAngular(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      this.setupMotion();
    }));
  }
  jumpTo(id: string): void {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.host.nativeElement.querySelector<HTMLElement>(`#${id}`)?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' });
  }
  private setupMotion(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') return;
    const root = this.host.nativeElement.querySelector<HTMLElement>('.about-page')!;
    this.observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const element = entry.target as HTMLElement;
        if (!entry.isIntersecting) {
          // Only pause decorative loops off screen; revealed content stays visible.
          if (element.hasAttribute('data-loop')) element.classList.remove('is-visible');
          continue;
        }

        element.classList.add('is-visible');
        if (!element.hasAttribute('data-loop')) this.observer?.unobserve(element);
        element.querySelectorAll<HTMLElement>('[data-count]').forEach(counter => {
          if (this.counted.has(counter)) return;
          this.counted.add(counter);
          this.animateCount(counter);
        });
      }
    }, { threshold: 0 });
    root.querySelectorAll<HTMLElement>('[data-reveal]').forEach(element => {
      const bounds = element.getBoundingClientRect();
      if (bounds.top < window.innerHeight && bounds.bottom > 0) element.classList.add('is-visible');
      this.observer!.observe(element);
    });
    root.classList.add('motion-ready');
  }
  @HostListener('pointerdown', ['$event'])
  onTouch(event: PointerEvent): void {
    if (event.pointerType === 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const element = (event.target as Element)?.closest<HTMLElement>('.metric, .opening-date, .operation-card, .leadership, .about-closing');
    if (!element || !this.host.nativeElement.contains(element)) return;
    this.clearPress();
    this.pressed = element;
    element.classList.add('is-pressed');
    this.pressTimer = setTimeout(() => this.clearPress(), 600);
  }
  @HostListener('window:pointerup')
  @HostListener('window:pointercancel')
  releaseTouch(): void {
    if (!this.pressed) return;
    clearTimeout(this.pressTimer);
    this.pressTimer = setTimeout(() => this.clearPress(), 160);
  }
  private clearPress(): void {
    clearTimeout(this.pressTimer);
    this.pressed?.classList.remove('is-pressed');
    this.pressed = undefined;
  }
  private animateCount(element: HTMLElement): void {
    const target = Number(element.dataset['count']);
    if (!target || target === 2023) return;
    const suffix = element.dataset['suffix'] ?? '';
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 1100, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * (.65 + .35 * eased)).toLocaleString('en-US') + suffix;
      if (progress < 1) schedule();
    };
    const schedule = () => {
      const id = requestAnimationFrame(now => { this.frames.delete(id); tick(now); });
      this.frames.add(id);
    };
    schedule();
  }
  ngOnDestroy(): void {
    this.clearPress();
    this.observer?.disconnect();
    this.frames.forEach(id => cancelAnimationFrame(id));
    this.frames.clear();
  }
}


