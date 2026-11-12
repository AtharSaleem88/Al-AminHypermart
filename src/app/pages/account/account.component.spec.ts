import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { CATALOG } from '../../data/catalog';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AccountComponent } from './account.component';
import { AccountService } from '../../services/account.service';

describe('Branded account area', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [AccountComponent], providers: [provideRouter([])] }));
  it('shows sign in instead of private account content to a signed-out visitor', () => {
    const fixture = TestBed.createComponent(AccountComponent);
    fixture.detectChanges(); const service = TestBed.inject(AccountService); service.ready.set(true); service.user.set(null); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#account-email')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.account-nav')).toBeNull();
    fixture.destroy();
  });
  it('displays account navigation and the signed-in user name', () => {
    const fixture = TestBed.createComponent(AccountComponent); fixture.detectChanges();
    const service = TestBed.inject(AccountService); service.ready.set(true); service.user.set({ id: 'test', name: 'Test Shopper', email: 'test@example.test', phone: '', address: '', city: '' }); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Test');
    expect(fixture.nativeElement.querySelector('a[href="/account/orders"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('a[href="/account/details"]')).toBeTruthy();
    fixture.destroy();
  });
  it('rejects invalid credentials before calling the account service', async () => {
    const fixture = TestBed.createComponent(AccountComponent); fixture.detectChanges();
    const login = spyOn(TestBed.inject(AccountService), 'login');
    fixture.componentInstance.authForm.patchValue({ email: 'invalid', password: 'short' });
    await fixture.componentInstance.authenticate();
    expect(login).not.toHaveBeenCalled();
    expect(fixture.componentInstance.error()).toContain('valid email');
    fixture.destroy();
  });
  it('returns to the landing page after a successful sign in', async () => {
    const fixture = TestBed.createComponent(AccountComponent); fixture.detectChanges();
    spyOn(TestBed.inject(AccountService), 'login').and.resolveTo();
    const navigate = spyOn(TestBed.inject(Router), 'navigateByUrl').and.resolveTo(true);
    fixture.componentInstance.authForm.patchValue({ email: 'test@example.test', password: 'Preview-only-123' });
    await fixture.componentInstance.authenticate();
    expect(navigate).toHaveBeenCalledWith('/');
    fixture.destroy();
  });
  it('reorders current catalogue products at current prices without replacing the basket or duplicating a click', () => {
    const cart = TestBed.inject(CartService); cart.clearCart();
    const first = CATALOG[0], second = CATALOG[1];
    cart.addItem({ id: second.id, name: second.title, price: second.price, image: second.image });
    cart.addItem({ id: first.id, name: first.title, price: 1, image: first.image });
    const order = { id: 'TEST-REORDER', createdAt: new Date().toISOString(), total: 100, demo: true as const, accountId: 'test', items: [{ id: first.id, name: first.title, unitPrice: 50, quantity: 2, category: 'Test', image: first.image }, { id: 'removed', name: 'Unavailable item', unitPrice: 10, quantity: 1, category: 'Test', image: '' }] };
    spyOn(TestBed.inject(OrderService), 'accountHistory').and.returnValue([order]);
    const fixture = TestBed.createComponent(AccountComponent); fixture.detectChanges();
    fixture.componentInstance.reorder(order);
    expect(cart.items().find(item => item.id === first.id)?.quantity).toBe(3);
    expect(cart.items().find(item => item.id === first.id)?.unitPrice).toBe(first.price);
    expect(cart.items().find(item => item.id === second.id)?.quantity).toBe(1);
    expect(fixture.componentInstance.message()).toContain('Unavailable item');
    fixture.componentInstance.reorder(order);
    expect(cart.items().find(item => item.id === first.id)?.quantity).toBe(3);
    cart.dismissToast(); cart.clearCart(); fixture.destroy();
  });});

