import { TestBed } from '@angular/core/testing';
import { CATALOG, isProductAvailable, productAlternatives } from './catalog';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
describe('Stock availability and alternatives', () => {
  it('offers only other in-stock products from the same department', () => {
    const product = CATALOG.find(product => product.inStock === false)!;
    expect(isProductAvailable(product.id)).toBeFalse();
    const alternatives = productAlternatives(product.id);
    expect(alternatives.length).toBeGreaterThan(0);
    expect(alternatives.every(item => item.inStock !== false && item.department === product.department && item.id !== product.id)).toBeTrue();
  });
  it('prevents unavailable items from being added by either ID or title alias', () => {
    const cart = TestBed.inject(CartService); cart.clearCart();
    const product = CATALOG.find(product => product.inStock === false)!;
    cart.addItem({ id: product.id, name: product.title, price: product.price });
    cart.addItem({ id: 'legacy-alias', name: product.title, price: product.price });
    expect(cart.items().length).toBe(0);
    const replacement = productAlternatives(product.id)[0];
    cart.addItem({ id: replacement.id, name: replacement.title, price: replacement.price });
    expect(cart.items().length).toBe(1);
    cart.dismissToast(); cart.clearCart();
  });
  it('rejects stale unavailable checkout items even when invoked directly', () => {
    const product = CATALOG.find(product => product.inStock === false)!;
    expect(() => TestBed.inject(OrderService).placeDemoOrder('STOCK-TEST', [{ id: product.id, name: product.title, category: product.department, unitPrice: 4000, quantity: 1, image: product.image }], 3000)).toThrowError(/out of stock/);
  });
});
