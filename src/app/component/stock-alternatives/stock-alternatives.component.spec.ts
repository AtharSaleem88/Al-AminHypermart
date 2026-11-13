import { TestBed } from '@angular/core/testing';
import { StockAlternativesComponent } from './stock-alternatives.component';
import { CartService } from '../../services/cart.service';
import { productAlternatives } from '../../data/catalog';
describe('Choosing an alternative', () => {
  it('replaces an unavailable basket line with the original quantity', () => {
    const cart = { items: () => [{ id: 'beverage-kinnow-250ml', name: 'Sargodha Fresh Kinnow Orange Juice 250ml', quantity: 3 }], addItem: jasmine.createSpy('addItem'), removeItem: jasmine.createSpy('removeItem'), formatRs: (value: number) => String(value) };
    TestBed.configureTestingModule({ providers: [{ provide: CartService, useValue: cart }] });
    const fixture = TestBed.createComponent(StockAlternativesComponent);
    fixture.componentInstance.itemId = 'beverage-kinnow-250ml';
    const replacement = productAlternatives('beverage-kinnow-250ml')[0];
    fixture.componentInstance.choose(replacement);
    expect(cart.addItem).toHaveBeenCalledWith(jasmine.objectContaining({ id: replacement.id, price: replacement.price }), 3);
    expect(cart.removeItem).toHaveBeenCalledWith('beverage-kinnow-250ml');
    expect(fixture.componentInstance.replaced).toBeTrue();
    fixture.componentInstance.choose(replacement);
    expect(cart.addItem).toHaveBeenCalledTimes(1);
    fixture.destroy();
  });
});
