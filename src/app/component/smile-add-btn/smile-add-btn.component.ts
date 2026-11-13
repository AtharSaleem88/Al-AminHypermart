import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, Output, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { isProductAvailable } from '../../data/catalog';
import { StockAlternativesComponent } from '../stock-alternatives/stock-alternatives.component';

@Component({
  selector: 'app-smile-add-btn',
  standalone: true,
  imports: [CommonModule, StockAlternativesComponent],
  styles: [`
    :host { display: block; }
    .smile-add-wrap > [hidden] { display: none !important; }
  `],
  template: `
    @if (!available) { <app-stock-alternatives [itemId]="itemId" [itemName]="itemName" /> } @else {
    <div
      class="smile-add-wrap"
      [class.smile-add-wrap--full]="fullWidth"
      [class.has-qty]="quantityInCart > 0"
      [class.is-added]="recentlyAdded"
    >
        <button
          [hidden]="quantityInCart > 0"
          type="button"
          class="simple-add-btn"
          [class.simple-add-btn--full]="fullWidth"
          (click)="handlePrimaryAdd($event)"
          [attr.aria-label]="label + ' ' + itemName + ' to cart'"
        >
          <span>{{ label }}</span>
          <img class="simple-add-btn__smile" src="assets/images/logo/brand-smile.png" alt="" aria-hidden="true" />
        </button>
        <div
          [hidden]="quantityInCart === 0"
          class="simple-qty-control"
          role="group"
          [attr.aria-label]="'Cart quantity for ' + itemName"
          [class.simple-qty-control--full]="fullWidth"
          (click)="$event.stopPropagation(); $event.preventDefault()"
        >
          <button
            type="button"
            class="simple-qty-control__btn simple-qty-control__btn--minus"
            (click)="handleDecrease($event)"
            [attr.aria-label]="quantityInCart === 1 ? 'Remove ' + itemName + ' from cart' : 'Decrease quantity of ' + itemName"
          >
            <i class="ph-bold ph-minus"></i>
          </button>

          <span class="simple-qty-control__count" aria-live="polite" aria-atomic="true">
            <img class="simple-qty-control__smile" src="assets/images/logo/brand-smile.png" alt="" aria-hidden="true" />
            <span>{{ quantityInCart }}</span>
          </span>

          <button
            type="button"
            class="simple-qty-control__btn simple-qty-control__btn--plus"
            (click)="handleIncrease($event)"
            [attr.aria-label]="'Increase quantity of ' + itemName"
          >
            <i class="ph-bold ph-plus"></i>
          </button>
        </div>
    </div>
    }
  `,
})
export class SmileAddBtnComponent implements OnDestroy {
  @Input() label: string = 'Add';
  @Input() fullWidth: boolean = false;
  @Input() itemId?: string | number;
  @Input() itemName: string = '';
  @Output() add = new EventEmitter<Event>();

  readonly cartService = inject(CartService);
  private readonly document = inject(DOCUMENT);

  recentlyAdded: boolean = false;
  private resetTimer: ReturnType<typeof setTimeout> | null = null;

  get available(): boolean { return isProductAvailable(this.itemId, this.itemName); }
  get quantityInCart(): number {
    if (this.itemId === undefined && !this.itemName) {
      return 0;
    }
    return this.cartService.getItemQuantity(this.itemId, this.itemName);
  }

  handlePrimaryAdd(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    if (!this.available || this.quantityInCart > 0) {
      return;
    }
    this.add.emit(event);
    if (this.quantityInCart > 0) {
      this.flySmileToCart(event);
    }
    this.animateUpdate();
  }

  private flySmileToCart(event: Event): void {
    const view = this.document.defaultView;
    const source = event.currentTarget as HTMLElement | null;
    const target = Array.from(this.document.querySelectorAll<HTMLElement>('[data-cart-animation-target]')).find(element => element.getBoundingClientRect().width > 0 && element.getBoundingClientRect().height > 0);
    if (!view || !source || !target || view.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const start = source.getBoundingClientRect();
    const end = target.getBoundingClientRect();
    if (!end.width || !end.height) return;
    const smile = this.document.createElement('img');
    smile.src = 'assets/images/logo/brand-smile.png';
    smile.alt = '';
    smile.setAttribute('aria-hidden', 'true');
    Object.assign(smile.style, {
      position: 'fixed', left: `${start.left + start.width / 2 - 14}px`,
      top: `${start.top + start.height / 2 - 14}px`, width: '28px', height: '28px',
      borderRadius: '50%', pointerEvents: 'none', zIndex: '1000001',
    });
    this.document.body.appendChild(smile);
    const dx = end.left + end.width / 2 - (start.left + start.width / 2);
    const dy = Math.max(-28, end.top + end.height / 2) - (start.top + start.height / 2);
    const flight = smile.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${dx * .45}px, ${dy * .6 - 45}px) rotate(-18deg) scale(1.15)`, opacity: 1, offset: .5 },
      { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(1)`, opacity: 1 },
    ], { duration: 1100, easing: 'cubic-bezier(.3, 0, .65, 1)', fill: 'forwards' });
    flight.finished.then(() => {
      if (target.isConnected) target.animate([
        { transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' },
      ], { duration: 350, easing: 'ease-out' });
      // Absorb the smile only after it has visibly reached the basket.
      const landing = smile.animate([
        { transform: `translate(${dx}px, ${dy}px) scale(1)`, opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(.15)`, opacity: 0 },
      ], { duration: 220, delay: 100, fill: 'forwards', easing: 'ease-in' });
      landing.finished.then(() => smile.remove(), () => smile.remove());
    }, () => smile.remove());
  }

  private animateUpdate(): void {
    this.recentlyAdded = false;
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
    }
    this.recentlyAdded = true;
    this.resetTimer = setTimeout(() => {
      this.recentlyAdded = false;
      this.resetTimer = null;
    }, 1000);
  }

  handleIncrease(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.cartService.increaseQuantity(
      this.cartService.resolveItemId(this.itemId, this.itemName)
    );
    if (this.quantityInCart > 0) this.flySmileToCart(event);
    this.animateUpdate();
  }

  handleDecrease(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    const resolvedId = this.cartService.resolveItemId(this.itemId, this.itemName);
    if (resolvedId) {
      this.cartService.decreaseQuantity(resolvedId);
    }
  }

  ngOnDestroy(): void {
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
    }
  }
}
