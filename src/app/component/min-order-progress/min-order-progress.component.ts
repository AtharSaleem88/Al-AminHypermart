import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-min-order-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="min-order-progress"
      [class.min-order-progress--compact]="compact"
      [class.is-met]="cartService.isMinimumMet()"
      [class.is-empty]="cartService.subtotal() === 0"
    >
      <!-- Header Row -->
      <div class="min-order-progress__head">
        @if (!compact) {
          <!-- Animated Smile Curve Gauge Badge (Full View) -->
          <div class="min-order-progress__smile-gauge" aria-hidden="true">
            <svg viewBox="0 0 60 28" class="min-order-progress__smile-svg">
              <path
                d="M 6 7 Q 30 25 54 7"
                fill="none"
                stroke="rgba(83, 23, 77, 0.16)"
                stroke-width="6"
                stroke-linecap="round"
              />
              <path
                d="M 6 7 Q 30 25 54 7"
                fill="none"
                stroke="#F89C24"
                stroke-width="6"
                stroke-linecap="round"
                pathLength="100"
                stroke-dasharray="100"
                [attr.stroke-dashoffset]="100 - cartService.progressPercent()"
                class="min-order-progress__smile-arc"
              />
            </svg>
            <span class="min-order-progress__pct">
              {{ cartService.progressPercent() | number:'1.0-0' }}%
            </span>
          </div>
        }

        <div class="min-order-progress__copy">
          <div class="min-order-progress__kicker-row">
            <span class="min-order-progress__kicker">
              Minimum order
            </span>
            <span class="min-order-progress__badge">
              @if (cartService.isMinimumMet()) {
                <i class="ph-fill ph-check-circle me-4"></i> Ready
              } @else {
                {{ cartService.progressPercent() | number:'1.0-0' }}% of Rs. 3,000
              }
            </span>
          </div>

          <p class="min-order-progress__message mb-0">
            @if (cartService.isMinimumMet()) {
              <strong>Your basket is ready.</strong> Minimum order reached.
            } @else if (cartService.subtotal() === 0) {
              Add <strong>{{ cartService.formatRs(cartService.MINIMUM_ORDER_RS) }}</strong> to reach our Rs. 3,000 minimum order.
            } @else {
              Spend <strong>{{ cartService.formatRs(cartService.remainingAmount()) }}</strong> more to reach our <strong>Rs. 3,000</strong> minimum order.
            }
          </p>
        </div>
      </div>

      <!-- Progress Track with Sliding Smile Coin -->
      <div
        class="min-order-progress__track-wrap"
        role="progressbar"
        aria-label="Rs. 3,000 minimum order progress"
        [attr.aria-valuenow]="cartService.subtotal() > cartService.MINIMUM_ORDER_RS ? cartService.MINIMUM_ORDER_RS : cartService.subtotal()"
        aria-valuemin="0"
        [attr.aria-valuemax]="cartService.MINIMUM_ORDER_RS"
      >
        <div class="min-order-progress__track">
          <div
            class="min-order-progress__fill"
            [style.width.%]="cartService.progressPercent()"
          ></div>
        </div>

        <div
          class="min-order-progress__smile-rider"
          [style.--smile-pct]="cartService.progressPercent() + '%'"
          [title]="cartService.isMinimumMet() ? 'Minimum order reached' : cartService.formatRs(cartService.remainingAmount()) + ' more needed'"
        >
          <img
            src="assets/images/logo/brand-smile.png"
            alt="Al-Amin Smile Progress"
            class="min-order-progress__rider-img"
          />
        </div>
      </div>

      <!-- Bottom Live Metrics -->
      <div class="min-order-progress__stats">
        <span class="min-order-progress__stat-current">
          In Cart: <strong>{{ cartService.formatRs(cartService.subtotal()) }}</strong>
        </span>

        @if (!compact) {
          <span class="min-order-progress__stat-remaining">
            @if (cartService.isMinimumMet()) {
              <span class="text-success-600 fw-semibold">
                <i class="ph ph-check me-4"></i>Checkout Enabled
              </span>
            } @else {
              Need: <strong>{{ cartService.formatRs(cartService.remainingAmount()) }}</strong>
            }
          </span>
        }

        <span class="min-order-progress__stat-target">
          Min: <strong>Rs. 3,000</strong>
        </span>
      </div>
    </div>
  `,
})
export class MinOrderProgressComponent {
  @Input() compact: boolean = false;
  readonly cartService = inject(CartService);
}
