import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CATALOG, CatalogProduct, DEPARTMENTS } from '../../data/catalog';
import { SmileAddBtnComponent } from '../../component/smile-add-btn/smile-add-btn.component';
import { WishlistButtonComponent } from '../../component/wishlist-button/wishlist-button.component';
import { CartService } from '../../services/cart.service';

@Component({
  standalone: true,
  imports: [RouterLink, SmileAddBtnComponent, WishlistButtonComponent],
  template: `
    <section class="container container-lg product-page">
      @if (product; as p) {
        <nav aria-label="Breadcrumb">
          <a routerLink="/">Home</a><span aria-hidden="true">/</span>
          <a routerLink="/shop" [queryParams]="{category: p.department}">{{ departmentName }}</a>
          <span aria-hidden="true">/</span><span class="breadcrumb-product" aria-current="page" [title]="p.title">{{ p.title }}</span>
        </nav>
        <article class="product-detail">
          <div class="product-detail__image">
            @if (p.inStock === false) { <span class="stock-badge">Out of stock</span> }
            <app-wishlist-button [itemId]="p.id" [itemName]="p.title" />
            <img [src]="p.image" [alt]="p.title" />
          </div>
          <div class="product-detail__copy">
            <a routerLink="/shop" [queryParams]="{brand: p.brand}" class="product-brand">{{ p.brand }}</a>
            <h1>{{ p.title }}</h1>
            <div class="product-meta"><span><i class="ph-fill ph-star" aria-hidden="true"></i> {{ p.rating }} <span class="sr-only">out of 5</span></span><a routerLink="/shop" [queryParams]="{category: p.department}">{{ departmentName }}</a></div>
            <div class="product-prices"><strong>{{ cart.formatRs(p.price) }}</strong>@if (p.oldPrice > p.price) { <del>{{ cart.formatRs(p.oldPrice) }}</del><span class="saving">Save {{ cart.formatRs(p.oldPrice - p.price) }}</span> }</div>
            <div class="purchase-panel">
              <app-smile-add-btn label="Add to basket" [showStockLabel]="false" [itemId]="p.id" [itemName]="p.title" [fullWidth]="true" (add)="add()" />
              <p>Minimum order {{ cart.formatRs(cart.MINIMUM_ORDER_RS) }} across your basket.</p>
            </div>
            <details class="product-information"><summary>Product information <i class="ph ph-plus" aria-hidden="true"></i></summary><dl><div><dt>Brand</dt><dd>{{ p.brand }}</dd></div><div><dt>Department</dt><dd>{{ departmentName }}</dd></div></dl><p>Check the product packaging for ingredients, allergens and storage instructions.</p></details>
            <div class="product-links"><a routerLink="/shop" [queryParams]="{category: p.department}">Explore this department <i class="ph ph-arrow-right" aria-hidden="true"></i></a><a routerLink="/cart">View basket</a></div>
          </div>
        </article>
      } @else {
        <div class="not-found"><img src="assets/images/logo/brand-smile-clean.svg" alt="" /><h1>Product not found</h1><p>Explore the shop to find your everyday favourites.</p><a routerLink="/shop">Back to shop →</a></div>
      }
    </section>
  `,
  styleUrl: './catalog-product.component.scss',
})
export class CatalogProductComponent {
  private readonly route = inject(ActivatedRoute);
  readonly cart = inject(CartService);
  product?: CatalogProduct;
  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed(inject(DestroyRef))).subscribe(params => {
      this.product = CATALOG.find(product => product.id === params.get('id'));
    });
  }
  get departmentName() { return DEPARTMENTS.find(department => department.id === this.product?.department)?.name ?? ''; }
  add(): void {
    const product = this.product;
    if (product) this.cart.addItem({ id: product.id, name: product.title, category: this.departmentName, price: product.price, image: product.image, rating: product.rating });
  }
}
