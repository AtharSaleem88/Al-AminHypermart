import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { AboutComponent } from './about.component';

describe('About Us content and routing', () => {
  it('keeps the storefront visible after leaving and revisiting the viewport', () => {
    let notify!: IntersectionObserverCallback;
    const observer = jasmine.createSpyObj<IntersectionObserver>('observer', ['observe', 'unobserve', 'disconnect']);
    spyOn(window, 'IntersectionObserver').and.callFake(function(callback: IntersectionObserverCallback) { notify = callback; return observer; });
    const fixture = TestBed.createComponent(AboutComponent);
    fixture.detectChanges();
    (fixture.componentInstance as unknown as { setupMotion(): void }).setupMotion();
    const image: HTMLElement = fixture.nativeElement.querySelector('.storefront-photo');
    const entry = (visible: boolean) => ({ target: image, isIntersecting: visible, intersectionRatio: visible ? .01 : 0 } as unknown as IntersectionObserverEntry);
    notify([entry(true)], observer);
    expect(image.classList.contains('is-visible')).toBeTrue();
    expect(observer.unobserve).toHaveBeenCalledWith(image);
    notify([entry(false)], observer);
    expect(image.classList.contains('is-visible')).toBeTrue();
    fixture.destroy();
  });
  it('gives touch feedback without making desktop pointer presses sticky', fakeAsync(() => {
    const fixture = TestBed.createComponent(AboutComponent);
    fixture.detectChanges();
    const metric: HTMLElement = fixture.nativeElement.querySelector('.metric');
    metric.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'mouse' }));
    expect(metric.classList.contains('is-pressed')).toBeFalse();
    metric.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch' }));
    expect(metric.classList.contains('is-pressed')).toBeTrue();
    window.dispatchEvent(new PointerEvent('pointerup', { pointerType: 'touch' }));
    tick(170);
    expect(metric.classList.contains('is-pressed')).toBeFalse();
    fixture.destroy();
  }));
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([
    {path: 'about-us', component: AboutComponent},
    {path: 'about', redirectTo: 'about-us', pathMatch: 'full'},
    {path: 'page/AboutUs', redirectTo: 'about-us', pathMatch: 'full'},
  ])] }));
  it('preserves all source sections, founder details, metrics and operating principles', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/about-us', AboutComponent);
    const page = harness.routeNativeElement!;
    const text = page.textContent!;
    for (const content of ['March 1st, 2023', 'Ashraf', 'Founder · Managing Director · CEO', '80,000', '300+', 'Departments under one roof', 'Year of establishment', 'Integrated Supply Chain', 'One Unwavering Standard', 'on-site warehouse', 'no hidden markups', 'Gujranwala']) expect(text).toContain(content);
    expect(page.querySelector('blockquote')!.textContent).toContain('We earn that trust every single day');
    expect(page.querySelectorAll('.metric').length).toBe(4);
    expect(page.querySelectorAll('.operation-card').length).toBe(2);
    expect(page.querySelector('h1')).toBeTruthy();
    expect(page.querySelector('.storefront-photo img')!.getAttribute('src')).toBe('assets/images/bg/about-storefront.jpg');
    expect(page.querySelector('.about-button')!.getAttribute('href')).toBe('/shop');
    expect(page.querySelectorAll('.about-marquee__group').length).toBe(2);
    expect(page.querySelector('.brand-orbit textPath')).toBeTruthy();
  });
  it('keeps the original AboutUs URL working and supports the short alias', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/page/AboutUs');
    expect(TestBed.inject(Router).url).toBe('/about-us');
    expect(harness.routeNativeElement!.querySelector('h1')!.getAttribute('aria-label')).toBe('About Al-Amin Hypermart');
    await harness.navigateByUrl('/about');
    expect(TestBed.inject(Router).url).toBe('/about-us');
  });
});




