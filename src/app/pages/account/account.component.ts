import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { AccountService } from '../../services/account.service';
import { CATALOG } from '../../data/catalog';
import { CartService } from '../../services/cart.service';
import { OrderReceipt, OrderService } from '../../services/order.service';

@Component({ selector: 'app-account', imports: [CommonModule, RouterLink, ReactiveFormsModule], templateUrl: './account.component.html', styleUrl: './account.component.scss' })
export class AccountComponent {
  readonly account = inject(AccountService);
  private readonly orders = inject(OrderService);
  private readonly cart = inject(CartService);
  readonly reordered = signal('');
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly routeData = toSignal(this.route.data, { initialValue: this.route.snapshot.data });
  readonly registering = computed(() => this.routeData()['mode'] === 'register');
  readonly view = computed(() => this.routeData()['view'] ?? 'overview');
  readonly history = computed(() => { this.account.user(); return this.orders.accountHistory(); });
  readonly totalSpent = computed(() => this.history().reduce((sum, order) => sum + order.total, 0));
  readonly busy = signal(false);
  readonly error = signal('');
  readonly message = signal('');
  showPassword = false;
  readonly authForm = this.fb.group({ name: [''], email: ['', [Validators.required, Validators.email]], password: ['', [Validators.required, Validators.minLength(8)]], confirm: [''] });
  readonly profileForm = this.fb.group({ name: ['', [Validators.required, Validators.pattern(/\S/)]], email: ['', [Validators.required, Validators.email]], phone: ['', Validators.pattern(/^$|^\+?[\d\s()-]{10,20}$/)], address: [''], city: [''] });
  constructor() {
    effect(() => { if (this.account.ready() && this.account.user() && this.routeData()['auth']) void this.router.navigateByUrl('/'); });
    effect(() => {
      const user = this.account.user();
      if (user) this.profileForm.patchValue(user);
    });
    effect(() => { this.routeData(); this.error.set(''); this.message.set(''); this.authForm.reset(); if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'instant' }); });
  }
  invalid(field: keyof typeof this.authForm.controls): boolean { const control = this.authForm.controls[field]; return control.invalid && control.touched; }
  async authenticate(): Promise<void> {
    if (this.busy()) return;
    this.authForm.markAllAsTouched(); this.error.set('');
    const values = this.authForm.getRawValue();
    if (this.authForm.invalid) { this.error.set('Please enter a valid email and a password of at least 8 characters.'); return; }
    if (this.registering() && (!values.name.trim() || values.password !== values.confirm)) { this.error.set(!values.name.trim() ? 'Please enter your full name.' : 'Your passwords do not match.'); return; }
    this.busy.set(true);
    try {
      if (this.registering()) await this.account.register(values.name, values.email, values.password);
      else await this.account.login(values.email, values.password);
      this.authForm.reset();
      await this.router.navigateByUrl('/');
    } catch (error) { this.error.set(error instanceof Error ? error.message : 'We could not sign you in. Please try again.'); }
    finally { this.busy.set(false); }
  }
  reorder(order: OrderReceipt): void {
    this.error.set(''); this.message.set('');
    if (!this.history().some(receipt => receipt.id === order.id) || this.reordered() === order.id) return;
    let added = 0;
    const unavailable: string[] = [];
    for (const item of order.items) {
      const product = CATALOG.find(product => product.id === item.id) ?? CATALOG.find(product => product.title === item.name);
      if (!product || product.inStock === false) { unavailable.push(item.name); continue; }
      this.cart.addItem({ id: product.id, name: product.title, price: product.price, image: product.image, category: item.category }, item.quantity);
      added += item.quantity;
    }
    if (!added) { this.error.set('These products are no longer in our current catalogue. Please browse the shop for alternatives.'); return; }
    this.reordered.set(order.id);
    this.message.set(`${added} ${added === 1 ? 'item added' : 'items added'} to your basket at current prices.${unavailable.length ? ' Unavailable: ' + unavailable.join(', ') + '.' : ''}`);
  }
  saveDetails(): void {
    this.profileForm.markAllAsTouched(); this.message.set(''); this.error.set('');
    if (this.profileForm.invalid) { this.error.set('Please check your name, email and phone number.'); return; }
    try { this.account.update(this.profileForm.getRawValue()); this.message.set('Your account details have been saved.'); }
    catch (error) { this.error.set(error instanceof Error ? error.message : 'Your changes could not be saved.'); }
  }
  async logout(): Promise<void> { try { this.account.logout(); await this.router.navigateByUrl('/login'); } catch { this.error.set('Sign out could not be completed. Please try again.'); } }
}
