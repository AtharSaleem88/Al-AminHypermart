import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogProduct, DEPARTMENTS } from '../../data/catalog';
import { CartService } from '../../services/cart.service';
import { SmileAddBtnComponent } from '../smile-add-btn/smile-add-btn.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, SmileAddBtnComponent],
  template: `
    <article class="catalog-card">
      <a class="catalog-card__image" [routerLink]="['/shop/product', product.id]" [attr.aria-label]="product.title">
        <img [src]="product.image" [alt]="product.title" loading="lazy" />
      </a>
      <div class="catalog-card__body">
        <span class="catalog-card__category">{{ departmentName }}</span>
        <h3><a [routerLink]="['/shop/product', product.id]">{{ product.title }}</a></h3>
        <div class="catalog-card__prices"><strong>{{ cart.formatRs(product.price) }}</strong>
          @if (product.oldPrice > product.price) { <del>{{ cart.formatRs(product.oldPrice) }}</del> }
        </div>
        <app-smile-add-btn label="Add" [fullWidth]="true" [itemId]="product.id" [itemName]="product.title" (add)="add()" />
      </div>
    </article>
  `,
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input({ required: true }) product!: CatalogProduct;
  readonly cart = inject(CartService);
  get departmentName(): string { return DEPARTMENTS.find(d => d.id === this.product.department)?.name ?? 'Al-Amin Finds'; }
  add(): void {
    this.cart.addItem({ id: this.product.id, name: this.product.title, category: this.departmentName,
      price: this.product.price, image: this.product.image, rating: this.product.rating });
  }
}
