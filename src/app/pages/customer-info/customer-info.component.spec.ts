import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../app.routes';

describe('Branded customer information pages', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter(
    routes[0].children!.filter(route => ['mobile-app', 'email-signup', 'account-deletion', 'page/MobileApp', 'page/emailsignup', 'page/CustomerAccountDelete'].includes(route.path!))
  )] }));
  it('preserves all three original page URLs', async () => {
    const harness = await RouterTestingHarness.create();
    for (const [url, title] of [['/page/MobileApp', 'Mobile App'], ['/page/emailsignup', 'Email Sign Up'], ['/page/CustomerAccountDelete', 'Account Deletion']]) {
      await harness.navigateByUrl(url);
      expect(harness.routeNativeElement!.querySelector('h1')!.textContent).toContain(title);
    }
  });
  it('links to the actual Al-Amin apps and preserves download and support instructions', async () => {
    const harness = await RouterTestingHarness.create('/mobile-app');
    const page = harness.routeNativeElement!;
    expect(page.querySelector('a[href="https://apps.apple.com/ph/app/al-amin-hyper-mart/id6762094958"]')).toBeTruthy();
    expect(page.querySelector('a[href="https://play.google.com/store/apps/details?id=com.alaminhypermart"]')).toBeTruthy();
    expect(page.textContent).toContain('reinstall');
    expect(page.querySelector('a[href="tel:+923210011142"]')).toBeTruthy();
  });
  it('preserves email benefits and privacy choices without pretending a subscription was submitted', async () => {
    const harness = await RouterTestingHarness.create('/email-signup');
    const page = harness.routeNativeElement!;
    for (const text of ['Promotions & early access', 'Weekly updates & tips', 'unsubscribe', 'never shared']) expect(page.textContent).toContain(text);
    expect(page.querySelector('a[href^="mailto:"]')!.textContent).toContain('Contact us to join');
    expect(page.querySelector('form')).toBeNull();
  });
  it('explains deletion verification and retention and opens only an email request', async () => {
    const harness = await RouterTestingHarness.create('/account-deletion');
    const page = harness.routeNativeElement!;
    for (const text of ['registered mobile number', '7 working days', '90 days', 'saved delivery locations', 'local purchase history']) expect(page.textContent).toContain(text);
    const action = page.querySelector<HTMLAnchorElement>('a[href^="mailto:"]')!;
    expect(action.getAttribute('href')).toContain('subject=Account%20Removal%20Request');
    expect(page.textContent).toContain('Your account is not deleted by clicking this link');
    expect(page.querySelector('form')).toBeNull();
  });
});
