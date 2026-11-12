import { TestBed } from '@angular/core/testing';
import { AccountService } from './account.service';
import { OrderService } from './order.service';
import { CartItem } from './cart.service';

describe('Browser preview accounts and order history', () => {
  const localKeys = ['al_amin_accounts_preview_v1', 'al_amin_order_history_preview_v1'];
  const sessionKeys = ['al_amin_account_session_v1', 'al_amin_demo_order_v1'];
  let savedLocal: (string | null)[];
  let savedSession: (string | null)[];
  let account: AccountService;
  beforeEach(() => {
    savedLocal = localKeys.map(key => localStorage.getItem(key));
    savedSession = sessionKeys.map(key => sessionStorage.getItem(key));
    localKeys.forEach(key => localStorage.removeItem(key)); sessionKeys.forEach(key => sessionStorage.removeItem(key));
    TestBed.configureTestingModule({}); account = TestBed.inject(AccountService);
  });
  afterEach(() => {
    localKeys.forEach((key, i) => savedLocal[i] === null ? localStorage.removeItem(key) : localStorage.setItem(key, savedLocal[i]!));
    sessionKeys.forEach((key, i) => savedSession[i] === null ? sessionStorage.removeItem(key) : sessionStorage.setItem(key, savedSession[i]!));
  });
  it('creates an account without storing a plain password and rejects wrong or duplicate credentials', async () => {
    await account.register('Test Shopper', ' Shopper@example.test ', 'Demo-only-123');
    expect(account.user()?.email).toBe('shopper@example.test');
    expect(localStorage.getItem(localKeys[0])).not.toContain('Demo-only-123');
    account.logout();
    await expectAsync(account.login('shopper@example.test', 'wrong-password')).toBeRejectedWithError(/incorrect/);
    expect(account.user()).toBeNull();
    await expectAsync(account.register('Another', 'SHOPPER@example.test', 'Demo-only-123')).toBeRejectedWithError(/already exists/);
    await account.login('SHOPPER@example.test', 'Demo-only-123');
    expect(account.user()?.name).toBe('Test Shopper');
  });
  it('persists edited details and uses the updated sign-in email', async () => {
    await account.register('Test Shopper', 'shopper@example.test', 'Demo-only-123');
    account.update({ name: 'Updated Shopper', email: 'updated@example.test', phone: '03001234567', address: 'Demo street', city: 'Gujranwala' });
    account.logout();
    await expectAsync(account.login('shopper@example.test', 'Demo-only-123')).toBeRejected();
    await account.login('updated@example.test', 'Demo-only-123');
    expect(account.user()?.address).toBe('Demo street');
    expect(account.user()?.name).toBe('Updated Shopper');
  });
  it('keeps complete order lines per account, avoids duplicates, and excludes guest orders', async () => {
    const orders = TestBed.inject(OrderService);
    const items: CartItem[] = [{ id: 'test-product', name: 'Test product', category: 'Test', unitPrice: 1600, quantity: 2, image: 'test.png' }];
    await account.register('First', 'first@example.test', 'Demo-only-123');
    orders.placeDemoOrder('TEST-FIRST', items, 3000);
    orders.placeDemoOrder('TEST-FIRST', items, 3000);
    items[0].quantity = 3;
    expect(orders.accountHistory().length).toBe(1);
    expect(orders.accountHistory()[0].items[0].quantity).toBe(2);
    account.logout();
    orders.placeDemoOrder('TEST-GUEST', items, 3000);
    expect(orders.accountHistory()).toEqual([]);
    await account.register('Second', 'second@example.test', 'Demo-only-123');
    expect(orders.accountHistory()).toEqual([]);
    orders.placeDemoOrder('TEST-SECOND', items, 3000);
    expect(orders.accountHistory().map(order => order.id)).toEqual(['TEST-SECOND']);
    account.logout(); await account.login('first@example.test', 'Demo-only-123');
    expect(orders.accountHistory().map(order => order.id)).toEqual(['TEST-FIRST']);
  });
  it('provides demo login on a fresh browser without overwriting saved profile changes', async () => {
    await expectAsync(account.login(account.demoCredentials.email, 'wrong-password')).toBeRejectedWithError(/incorrect/);
    expect(account.user()).toBeNull();
    await account.login(account.demoCredentials.email, account.demoCredentials.password);
    expect(account.user()?.name).toBe('Demo Shopper');
    const id = account.user()!.id;
    account.update({ name: 'Demo Updated', email: account.demoCredentials.email, phone: '', address: '', city: '' });
    account.logout();
    await account.login(account.demoCredentials.email, account.demoCredentials.password);
    expect(account.user()?.id).toBe(id);
    expect(account.user()?.name).toBe('Demo Updated');
    expect(localStorage.getItem(localKeys[0])).not.toContain(account.demoCredentials.password);
  });});

