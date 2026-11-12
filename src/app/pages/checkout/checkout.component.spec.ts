import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CheckoutComponent } from './checkout.component';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

describe('Branded checkout', () => {
  let fixture: ComponentFixture<CheckoutComponent>;
  let component: CheckoutComponent;
  let cart: CartService;
  const details = {firstName: 'Ayesha', lastName: 'Khan', email: 'ayesha@example.com', phone: '+92 300 1234567', address: '12 Garden Road', apartment: '', city: 'Lahore', province: 'Punjab', postalCode: '', notes: '', payment: 'cod'};
  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [CheckoutComponent], providers: [provideRouter([])]}).compileComponents();
    cart = TestBed.inject(CartService); cart.clearCart(); sessionStorage.removeItem('al_amin_demo_order_v1');
    fixture = TestBed.createComponent(CheckoutComponent); component = fixture.componentInstance;
  });
  afterEach(() => { cart.dismissToast(); cart.clearCart(); sessionStorage.removeItem('al_amin_demo_order_v1'); });
  function fillBasket(price = 3700) { cart.addItem({id: 'checkout-test', name: 'Family grocery basket', price, image: 'assets/images/thumbs/cat-pantry.jpg'}); }
  it('shows the shop action instead of delivery fields for an empty basket', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.checkout-empty')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#checkout-form')).toBeNull();
  });
  it('validates required fields on submission and rejects whitespace and malformed contact details', () => {
    fillBasket(); fixture.detectChanges();
    component.reviewOrder(); fixture.detectChanges();
    expect(component.reviewReady).toBeFalse();
    expect(fixture.nativeElement.querySelectorAll('.field-error').length).toBe(7);
    component.form.setValue({...details, firstName: '   ', phone: 'letters', email: 'invalid'});
    expect(component.form.controls.firstName.invalid).toBeTrue();
    expect(component.form.controls.phone.invalid).toBeTrue();
    expect(component.form.controls.email.invalid).toBeTrue();
  });
  it('prevents review below the minimum even when invoked directly', () => {
    fillBasket(480); component.form.setValue(details); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button[form="checkout-form"]').disabled).toBeTrue();
    component.reviewOrder(); expect(component.reviewReady).toBeFalse();
  });
  it('reviews valid details without claiming an order was received or clearing the basket', () => {
    fillBasket(); component.form.setValue(details); fixture.detectChanges();
    fixture.nativeElement.querySelector('#checkout-form').dispatchEvent(new Event('submit', {bubbles: true, cancelable: true}));
    fixture.detectChanges();
    expect(component.reviewReady).toBeTrue(); expect(component.reviewTotal).toBe(3700);
    expect(cart.subtotal()).toBe(3700); expect(cart.itemCount()).toBe(1);
    expect(fixture.nativeElement.querySelector('.checkout-review').textContent).toContain('Ayesha Khan');
    expect(fixture.nativeElement.textContent).toContain('This is a demo checkout');
    fixture.nativeElement.querySelector('.review-actions .checkout-secondary').click(); fixture.detectChanges();
    expect(component.reviewReady).toBeFalse(); expect(component.form.controls.address.value).toBe(details.address);
  });
  it('places a reviewed demo order once, saves its receipt and clears the basket', () => {
    fillBasket(); component.form.setValue(details); component.reviewOrder(); fixture.detectChanges();
    const orderService = TestBed.inject(OrderService);
    const save = spyOn(orderService, 'placeDemoOrder').and.callThrough();
    fixture.nativeElement.querySelector('.place-order-button').click(); fixture.detectChanges();
    expect(component.placedOrder?.total).toBe(3700);
    expect(cart.itemCount()).toBe(0);
    expect(fixture.nativeElement.querySelector('.order-confirmation').textContent).toContain('Your order is placed!');
    expect(orderService.lastReceipt()?.id).toBe(component.placedOrder?.id);
    expect(document.activeElement?.id).toBe('confirmation-title');
    expect(sessionStorage.getItem('al_amin_demo_order_v1')).not.toContain(details.email);
    expect(sessionStorage.getItem('al_amin_demo_order_v1')).not.toContain(details.address);
    component.placeOrder();
    expect(save).toHaveBeenCalledTimes(1);
  });
  it('keeps the basket and review when receipt storage fails', () => {
    fillBasket(); component.form.setValue(details); component.reviewOrder();
    spyOn(Storage.prototype, 'setItem').and.throwError('Quota exceeded');
    component.placeOrder();
    expect(component.placedOrder).toBeNull(); expect(cart.subtotal()).toBe(3700);
    expect(component.reviewReady).toBeTrue(); expect(component.orderError).toContain('Your basket is safe');
  });
  it('renders purchased lines from the receipt after the basket is cleared', () => {
    cart.addItem({ id: 'line-rice', name: 'Basmati rice', price: 1850, image: 'assets/images/thumbs/pk-basmati-rice.jpg' }, 2);
    cart.addItem({ id: 'line-greens', name: 'Fresh greens', price: 480, image: 'assets/images/thumbs/cat-vegetables.jpg' }, 2);
    component.form.setValue(details); component.reviewOrder(); component.placeOrder(); fixture.detectChanges();
    const lines = fixture.nativeElement.querySelectorAll('.confirmed-item');
    expect(cart.items().length).toBe(0);
    expect(lines.length).toBe(2);
    expect(lines[0].textContent).toContain('Basmati rice');
    expect(lines[0].textContent).toContain('Qty 2');
    expect(lines[0].querySelector('.confirmed-item__total').textContent).toContain('3,700');
    expect(lines[1].querySelector('.confirmed-item__total').textContent).toContain('960');
    expect(fixture.nativeElement.querySelector('.order-confirmation__receipt').textContent).toContain('4,660');
    cart.addItem({ id: 'new-basket', name: 'New item', price: 500 }); fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.confirmed-item').length).toBe(2);
    expect(fixture.nativeElement.querySelector('.confirmed-items').textContent).not.toContain('New item');
  });
  it('requires a new review if basket quantities change after review', () => {
    fillBasket(); component.form.setValue(details); component.reviewOrder();
    cart.increaseQuantity('checkout-test'); component.placeOrder();
    expect(component.placedOrder).toBeNull(); expect(cart.itemCount()).toBe(2);
    expect(component.orderError).toContain('Your basket changed');
  });});
