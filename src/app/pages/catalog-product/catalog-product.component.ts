import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CATALOG, CatalogProduct, DEPARTMENTS } from '../../data/catalog';
import { SmileAddBtnComponent } from '../../component/smile-add-btn/smile-add-btn.component';
import { CartService } from '../../services/cart.service';

@Component({
  standalone: true, imports: [RouterLink, SmileAddBtnComponent],
  template: `
    <section class="container container-lg product-page">
      @if (product; as p) {
        <nav aria-label="Breadcrumb"><a routerLink="/">Home</a> / <a routerLink="/shop">Shop</a> / <a routerLink="/shop" [queryParams]="{category: p.department}">{{ departmentName }}</a> / <span aria-current="page">{{ p.title }}</span></nav>
        <div class="product-detail">
          <div class="product-detail__image"><img [src]="p.image" [alt]="p.title" /></div>
          <div class="product-detail__copy">
            <a routerLink="/shop" [queryParams]="{brand: p.brand}" class="product-brand">{{ p.brand }}</a>
            <h1>{{ p.title }}</h1>
            <p class="department-label">{{ departmentName }}</p>
            <div class="product-prices"><strong>{{ cart.formatRs(p.price) }}</strong>@if (p.oldPrice > p.price) { <del>{{ cart.formatRs(p.oldPrice) }}</del> }</div>
            <app-smile-add-btn [itemId]="p.id" [itemName]="p.title" [fullWidth]="true" (add)="add()" />
            <p class="minimum-note">Minimum order {{ cart.formatRs(cart.MINIMUM_ORDER_RS) }}. Your basket stays in sync as you shop.</p>
            <a routerLink="/shop" [queryParams]="{category: p.department}" class="browse-more">Explore more {{ departmentName.toLowerCase() }} <i class="ph ph-arrow-right"></i></a>
          </div>
        </div>
      } @else { <div class="not-found"><h1>Product not found</h1><p>Explore the shop to find your everyday favourites.</p><a routerLink="/shop">Back to shop</a></div> }
    </section>
  `,
  styles: [`
    .product-page { padding-top: 24px; padding-bottom: 64px; }
    nav { display: flex; flex-wrap: wrap; gap: 8px; font-size: 12px; margin-bottom: 32px; color: #7B6A77; }
    nav a, .product-brand, .browse-more { color: #53174D; }
    .product-detail { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(24px, 5vw, 80px); align-items: center; }
    .product-detail__image { border: 1px solid #EDE1EC; border-radius: 20px; padding: 32px; }
    .product-detail__image img { width: 100%; height: 420px; object-fit: contain; }
    .product-detail__copy { max-width: 540px; }
    .product-brand { font-size: 13px; }
    h1 { color: #290E28; font-size: clamp(26px, 3vw, 38px); line-height: 1.2; margin: 12px 0; }
    .department-label, .minimum-note { color: #7B6A77; font-size: 13px; line-height: 1.6; }
    .product-prices { display: flex; flex-wrap: wrap; gap: 16px; align-items: baseline; margin: 24px 0; }
    strong { color: #53174D; font-size: 26px; } del { color: #8B818A; }
    .minimum-note { margin: 16px 0 24px; } .browse-more { font-size: 13px; }
    .not-found { text-align: center; padding: 64px 16px; }
    @media(max-width: 767px) { .product-detail { grid-template-columns: 1fr; } .product-detail__image img { height: 280px; } }
  `],
})
export class CatalogProductComponent {
  private readonly route = inject(ActivatedRoute);
  readonly cart = inject(CartService);
  product?: CatalogProduct;
  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed(inject(DestroyRef))).subscribe(params => {
      this.product = CATALOG.find(p => p.id === params.get('id'));
    });
  }
  get departmentName() { return DEPARTMENTS.find(d => d.id === this.product?.department)?.name ?? ''; }
  add() {
    const p = this.product;
    if (p) this.cart.addItem({ id: p.id, name: p.title, category: this.departmentName, price: p.price, image: p.image, rating: p.rating });
  }
}
