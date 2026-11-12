import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CartComponent } from './cart.component';
import { CartService } from '../../services/cart.service';
import { CATALOG } from '../../data/catalog';

describe('Branded cart page', () => {
  let fixture: ComponentFixture<CartComponent>;
  let cart: CartService;
  const vegetable = CATALOG.find(p => p.id === 'rec-pk-sabzi-greens')!;
  const rice = CATALOG.find(p => p.id === 'pk-basmati-rice-5kg')!;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CartComponent], providers: [provideRouter([])] }).compileComponents();
    cart = TestBed.inject(CartService);
    cart.clearCart();
    fixture = TestBed.createComponent(CartComponent);
  });
  afterEach(() => { cart.dismissToast(); cart.clearCart(); });
  function add(product: typeof vegetable, quantity = 1) {
    cart.addItem({id: product.id, name: product.title, price: product.price, image: product.image}, quantity);
  }
  it('updates totals and checkout eligibility when quantities change', () => {
    add(vegetable, 2); add(rice);
    fixture.detectChanges();
    expect(cart.subtotal()).toBe(2810);
    expect(fixture.nativeElement.querySelector('a.basket-checkout')).toBeNull();
    fixture.nativeElement.querySelector('.basket-item .simple-qty-control__btn--plus').click();
    fixture.detectChanges();
    expect(cart.subtotal()).toBe(3290);
    expect(fixture.nativeElement.querySelector('.summary-total').textContent).toContain('3,290');
    expect(fixture.nativeElement.querySelector('a.basket-checkout').getAttribute('href')).toBe('/checkout');
  });
  it('returns to the branded empty state when the last item is removed', () => {
    add(vegetable);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.basket-item__remove').click();
    fixture.detectChanges();
    expect(cart.itemCount()).toBe(0);
    expect(fixture.nativeElement.querySelector('.basket-empty')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.basket-summary')).toBeNull();
  });
  it('uses real product routes and omits items already in the basket from suggestions', () => {
    add(rice);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.basket-item__image').getAttribute('href')).toBe('/shop/product/' + rice.id);
    expect(fixture.componentInstance.suggestions.some(p => p.id === rice.id)).toBeFalse();
    expect(fixture.componentInstance.suggestions.length).toBeGreaterThan(0);
  });
});