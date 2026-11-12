import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AccountService } from '../../../services/account.service';
@Component({ template: '' }) class EmptyPage {}
describe('Authentication page chrome', () => {
  it('hides shopping chrome on auth routes and signed-out account routes, then restores it for shopping and signed-in settings', async () => {
    TestBed.configureTestingModule({ imports: [LayoutComponent], providers: [provideRouter([{ path: 'login', component: EmptyPage }, { path: 'create-account', component: EmptyPage }, { path: 'account/details', component: EmptyPage }, { path: '', component: EmptyPage }])] });
    TestBed.overrideComponent(LayoutComponent, { set: { template: '', imports: [] } });
    const fixture = TestBed.createComponent(LayoutComponent); fixture.detectChanges();
    const router = TestBed.inject(Router), account = TestBed.inject(AccountService); account.user.set(null);
    await router.navigateByUrl('/login'); expect(fixture.componentInstance.authScreen()).toBeTrue();
    await router.navigateByUrl('/create-account'); expect(fixture.componentInstance.authScreen()).toBeTrue();
    await router.navigateByUrl('/account/details'); expect(fixture.componentInstance.authScreen()).toBeTrue();
    account.user.set({ id: 'test', name: 'Test', email: 'test@example.test', phone: '', city: '', address: '' });
    expect(fixture.componentInstance.authScreen()).toBeFalse();
    await router.navigateByUrl('/'); expect(fixture.componentInstance.authScreen()).toBeFalse();
    fixture.destroy();
  });
});
