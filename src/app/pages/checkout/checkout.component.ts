import { Component, ElementRef, ViewChild, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CartItem, CartService } from '../../services/cart.service';
import { MinOrderProgressComponent } from '../../component/min-order-progress/min-order-progress.component';
import { AccountService } from '../../services/account.service';
import { OrderReceipt, OrderService } from '../../services/order.service';

function phoneNumber(control: AbstractControl): ValidationErrors | null {
  const value = String(control.value ?? '');
  const digits = value.replace(/\D/g, '');
  return /^\+?[\d\s()-]+$/.test(value) && digits.length >= 10 && digits.length <= 15 ? null : { phone: true };
}

@Component({
  selector: 'app-checkout', standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MinOrderProgressComponent],
  templateUrl: './checkout.component.html', styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  readonly account = inject(AccountService);
  readonly cartService = inject(CartService);
  private readonly orders = inject(OrderService);
  @ViewChild('confirmationTitle') set confirmationTitle(element: ElementRef<HTMLElement> | undefined) {
    element?.nativeElement.focus();
  }
  private readonly fb = inject(NonNullableFormBuilder);
  readonly form = this.fb.group({
    firstName: ['', [Validators.required, Validators.pattern(/\S/)]],
    lastName: ['', [Validators.required, Validators.pattern(/\S/)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, phoneNumber]],
    address: ['', [Validators.required, Validators.pattern(/\S/)]],
    apartment: [''], city: ['', [Validators.required, Validators.pattern(/\S/)]],
    province: ['', Validators.required], postalCode: [''], notes: [''], payment: ['cod', Validators.required],
  });
  readonly provinces = ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Islamabad Capital Territory', 'Gilgit-Baltistan', 'Azad Jammu & Kashmir'];
  reviewReady = false;
  reviewItems: CartItem[] = [];
  reviewTotal = 0;
  attempted = false;
  placingOrder = false;
  orderError = '';
  placedOrder: OrderReceipt | null = null;
  private reviewKey = '';
  constructor() {
    effect(() => {
      const user = this.account.user();
      if (!user) return;
      const names = user.name.trim().split(/\s+/);
      const values = { firstName: names[0], lastName: names.slice(1).join(' '), email: user.email, phone: user.phone, address: user.address, city: user.city };
      for (const key of Object.keys(values) as (keyof typeof values)[]) {
        const field = this.form.controls[key];
        if (field.pristine && !field.value) field.setValue(values[key]);
      }
    });
  }
  get details() { return this.form.getRawValue(); }
  invalid(name: keyof typeof this.form.controls): boolean {
    const field = this.form.controls[name];
    return field.invalid && (field.touched || this.attempted);
  }
  reviewOrder(): void {
    if (this.cartService.unavailableItems().length) { this.orderError = 'Some items are out of stock. Return to your basket to remove them or choose alternatives.'; return; }
    this.attempted = true;
    this.form.markAllAsTouched();
    if (this.form.invalid || !this.cartService.isMinimumMet() || !this.cartService.items().length) return;
    this.reviewItems = this.cartService.items().map(item => ({ ...item }));
    this.reviewTotal = this.cartService.subtotal();
    this.reviewKey = `ALM-${globalThis.crypto.randomUUID().toUpperCase()}`;
    this.orderError = '';
    this.reviewReady = true;
  }

  placeOrder(): void {
    if (!this.reviewReady || this.placingOrder || this.placedOrder || this.form.invalid) return;
    this.orderError = '';
    const current = this.cartService.items();
    const unchanged = current.length === this.reviewItems.length && this.reviewItems.every(reviewed =>
      current.some(item => item.id === reviewed.id && item.quantity === reviewed.quantity && item.unitPrice === reviewed.unitPrice));
    if (!unchanged || !this.cartService.isMinimumMet()) {
      this.orderError = 'Your basket changed. Return to your basket and review your updated items before placing the order.';
      return;
    }
    this.placingOrder = true;
    try {
      this.placedOrder = this.orders.placeDemoOrder(this.reviewKey, this.reviewItems, this.cartService.MINIMUM_ORDER_RS);
      this.cartService.clearCart();
      this.form.reset();
      this.reviewReady = false;
    } catch {
      this.orderError = 'We could not save your order in this browser. Your basket is safe. Please try again.';
    } finally {
      this.placingOrder = false;
    }
  }
}
