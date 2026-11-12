import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { HelpCenterComponent } from './help-center.component';

describe('Help Centre', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([
    { path: 'help-centre', component: HelpCenterComponent },
    { path: 'page/HelpCenter', redirectTo: 'help-centre', pathMatch: 'full' },
  ])] }));
  it('preserves all source questions and actionable contact details', () => {
    const fixture = TestBed.createComponent(HelpCenterComponent);
    fixture.detectChanges();
    const page: HTMLElement = fixture.nativeElement;
    expect(page.querySelectorAll('.help-answer').length).toBe(13);
    for (const text of ['30 minutes', 'Rs. 3,000', '3–4 hours', 'IPOS', '9 AM – 10 PM', 'Sialkot Bypass', 'guest', 'bakery']) expect(page.textContent).toContain(text);
    expect(page.querySelector('a[href="tel:+923210011142"]')).toBeTruthy();
    expect(page.querySelector('a[href="mailto:info@al-aminhypermart.com"]')).toBeTruthy();
    expect(page.querySelectorAll('.operation-card').length).toBe(4);
    fixture.destroy();
  });
  it('keeps the original HelpCenter URL working', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/page/HelpCenter');
    expect(TestBed.inject(Router).url).toBe('/help-centre');
    expect(harness.routeNativeElement!.querySelector('h1')!.getAttribute('aria-label')).toBe('Help Centre');
  });
});
