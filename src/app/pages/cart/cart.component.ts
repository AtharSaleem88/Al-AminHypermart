import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { MinOrderProgressComponent } from '../../component/min-order-progress/min-order-progress.component';
import { SmileAddBtnComponent } from '../../component/smile-add-btn/smile-add-btn.component';
import { ProductCardComponent } from '../../component/product-card/product-card.component';
import { CATALOG } from '../../data/catalog';

@Component({
  selector: 'app-cart', standalone: true,
  imports: [CommonModule, RouterLink, MinOrderProgressComponent, SmileAddBtnComponent, ProductCardComponent],
  templateUrl: './cart.component.html', styleUrl: './cart.component.scss',
})
export class CartComponent {
  readonly cartService = inject(CartService);
  private readonly catalogIds = new Set(CATALOG.map(p => p.id));
  productRoute(id: string): string[] { return this.catalogIds.has(id) ? ['/shop/product', id] : ['/shop']; }
  productQuery(id: string, name: string): Record<string, string> { return this.catalogIds.has(id) ? {} : {q: name}; }
  get suggestions() {
    const inCart = new Set(this.cartService.items().map(p => p.id));
    return CATALOG.filter(p => ['pantry', 'bakery', 'drinks'].includes(p.department) && !inCart.has(p.id)).sort((a, b) => a.price - b.price).slice(0, 3);
  }
}