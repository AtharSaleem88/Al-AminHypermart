import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { AccountService } from '../../services/account.service';
import { PasswordRecoveryService } from '../../services/password-recovery.service';
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
  private readonly recovery = inject(PasswordRecoveryService);
  private readonly queryParams = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });
  private readonly routeData = toSignal(this.route.data, { initialValue: this.route.snapshot.data });
  readonly registering = computed(() => this.routeData()['mode'] === 'register');
  readonly resetting = computed(() => this.routeData()['mode'] === 'reset' || !!(this.queryParams().get('token') && this.queryParams().get('email')));
  readonly recovering = computed(() => this.resetting() || this.routeData()['mode'] === 'forgot');
  readonly recoveryForm = this.fb.group({ email: ['', [Validators.required, Validators.email]], password: ['', [Validators.minLength(8)]], confirm: [''] });
  readonly recoverySuccess = signal(false);
  readonly view = computed(() => this.routeData()['view'] ?? 'details');
  readonly history = computed(() => { this.account.user(); return this.orders.accountHistory(); });
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
    effect(() => {
      this.routeData(); this.error.set(''); this.message.set('');
      this.authForm.reset(this.registering() ? {} : this.account.demoCredentials);
    });
    effect(() => {
      this.routeData(); const params = this.queryParams();
      this.recoverySuccess.set(false);
      this.recoveryForm.reset({ email: params.get('email') ?? '' });
    });
  }
  async recoverPassword(): Promise<void> {
    if (this.busy()) return;
    this.error.set(''); this.recoveryForm.markAllAsTouched();
    const values = this.recoveryForm.getRawValue();
    if (this.recoveryForm.controls.email.invalid) { this.error.set('Enter a valid email address.'); return; }
    if (this.resetting() && (values.password.length < 8 || values.password !== values.confirm)) { this.error.set('Use at least 8 characters and make sure both passwords match.'); return; }
    this.busy.set(true);
    try {
      if (this.resetting()) {
        await this.recovery.reset(values.email, this.queryParams().get('token') ?? '', values.password);
      } else await this.recovery.requestLink(values.email);
      this.recoveryForm.reset(); this.recoverySuccess.set(true);
    } catch (error) { this.error.set(error instanceof Error ? error.message : 'Password recovery could not be completed.'); }
    finally { this.busy.set(false); }
  }
  invalid(field: keyof typeof this.authForm.controls): boolean { const control = this.authForm.controls[field]; return control.invalid && control.touched; }
  openBasket(): void { this.cart.openDrawer(); }
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

