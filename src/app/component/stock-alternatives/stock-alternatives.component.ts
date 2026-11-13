import { WishlistButtonComponent } from '../wishlist-button/wishlist-button.component';
import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogProduct, findCatalogProduct, productAlternatives } from '../../data/catalog';
import { CartService } from '../../services/cart.service';
@Component({ selector: 'app-stock-alternatives', standalone: true, imports: [RouterLink, WishlistButtonComponent], template: `
  <div class="stock-options" (click)="$event.stopPropagation()">
    @if (showStockLabel) { <span class="stock-label">Out of stock</span> }
    <button type="button" class="alternatives-toggle" (click)="open()" aria-haspopup="dialog">See alternatives <i class="ph ph-arrows-left-right" aria-hidden="true"></i></button>
    <dialog #alternativesDialog class="alternatives" aria-label="In-stock alternatives" (close)="expanded = false" (click)="$event.target === alternativesDialog && alternativesDialog.close()">
      <div class="sheet-content"><div class="sheet-heading"><div><span>FIND YOUR NEXT FAVOURITE</span><h2>Fresh alternatives.</h2><p>Available picks from the same department.</p></div><button type="button" class="close-sheet" (click)="alternativesDialog.close()" aria-label="Close alternatives"><i class="ph ph-x" aria-hidden="true"></i></button></div>
      @if (expanded) { <div class="alternative-grid">@for (alternative of alternatives; track alternative.id) { <article style="position:relative"><app-wishlist-button [itemId]="alternative.id" [itemName]="alternative.title" /><a [routerLink]="['/shop/product', alternative.id]" (click)="alternativesDialog.close()"><img [src]="alternative.image" [alt]="alternative.title" loading="lazy" /><span>{{ alternative.title }}<strong>{{ cart.formatRs(alternative.price) }}</strong></span></a><button type="button" class="choose-button" (click)="choose(alternative)" [disabled]="added === alternative.id" [attr.aria-label]="'Add alternative ' + alternative.title">{{ added === alternative.id ? 'Added to basket' : 'Choose alternative' }}</button></article> }</div>
        @if (!alternatives.length) { <p>No alternatives in this department right now. <a routerLink="/shop" (click)="alternativesDialog.close()">Explore the shop →</a></p> }
      }
      @if (added) { <p class="added-notice" role="status">{{ replaced ? 'Unavailable item replaced in your basket.' : 'Alternative added to your basket.' }} <a routerLink="/cart" (click)="alternativesDialog.close()">View basket →</a></p> }
      </div>
    </dialog>
  </div>`, styles: [`
  :host { display: block; min-width: 0; } .stock-label { display: block; color: #796C79; font-size: 11px; font-weight: 600; margin-bottom: 8px; }
  button { cursor: pointer; } .alternatives-toggle { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; min-height: 42px; border: 1px solid #DCD1EB; border-radius: 22px; background: #F1EBF6; color: #53174D; font-size: 12px; font-weight: 600; padding: 8px 10px; }
  dialog { inset: 0; margin: auto; width: min(720px, calc(100vw - 40px)); max-height: 85dvh; border: 0; border-radius: 24px; padding: 0; background: #FBFAFC; color: #290E28; }
  dialog::backdrop { background: #290E2877; backdrop-filter: blur(4px); }
  .sheet-content { padding: 28px; } .sheet-heading { display: flex; justify-content: space-between; gap: 20px; margin-bottom: 24px; } .sheet-heading span { color: #9F85BD; font-size: 9px; letter-spacing: .1em; font-weight: 600; } h2 { font-size: 28px; color: #53174D; margin: 10px 0; } p { font-size: 13px; color: #796C79; line-height: 1.7; margin: 0; }
  .close-sheet { flex-shrink: 0; width: 40px; height: 40px; border: 0; border-radius: 50%; background: #F1EBF6; color: #53174D; font-size: 20px; }
  .alternative-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; } article { padding: 16px; border: 1px solid #E8E1EA; border-radius: 16px; background: #fff; display: flex; flex-direction: column; gap: 16px; } article a { color: #290E28; font-size: 12px; line-height: 1.6; } article img { display: block; width: 100%; height: 100px; object-fit: contain; margin-bottom: 14px; } strong { display: block; color: #53174D; font-size: 13px; margin-top: 8px; } .choose-button { margin-top: auto; min-height: 44px; padding: 8px 12px; border: 0; border-radius: 10px; background: #53174D; color: #fff; font-size: 11px; font-weight: 600; } .choose-button:disabled { background: #DCD1EB; color: #53174D; cursor: default; } .added-notice { margin-top: 20px; background: #F1EBF6; padding: 14px; border-radius: 10px; color: #53174D; } .added-notice a { color: #53174D; font-weight: 600; text-decoration: underline; white-space: nowrap; } a:focus-visible, button:focus-visible { outline: 2px solid #F89C24; outline-offset: 3px; }
  @media(max-width: 575px) { dialog { inset: auto 0 0; margin: 0; width: 100%; max-width: 100%; max-height: 82dvh; border-radius: 24px 24px 0 0; } .sheet-content { padding: 24px 20px calc(24px + env(safe-area-inset-bottom, 0px)); } .alternative-grid { grid-template-columns: 1fr; gap: 12px; } article { display: grid; grid-template-columns: minmax(0, 1fr); align-items: center; gap: 12px; padding: 14px; } article a { display: flex; align-items: center; gap: 12px; } article img { width: 54px; height: 64px; margin: 0; } .choose-button { margin: 0; max-width: none; width: 100%; } h2 { font-size: 25px; } }
`] })
export class StockAlternativesComponent {
  @Input() showStockLabel = true;
  @Input() itemId?: string | number;
  @Input() itemName = '';
  @ViewChild('alternativesDialog') dialog!: ElementRef<HTMLDialogElement>;
  readonly cart = inject(CartService);
  expanded = false;
  added = '';
  replaced = false;
  get alternatives() { return productAlternatives(this.itemId, this.itemName); }
  open(): void { this.expanded = true; this.added = ''; this.replaced = false; this.dialog.nativeElement.showModal(); }
  choose(product: CatalogProduct): void {
    if (product.inStock === false || this.added === product.id) return;
    const source = findCatalogProduct(this.itemId, this.itemName);
    const existing = this.cart.items().find(item => item.id === source?.id || item.name === source?.title);
    this.cart.addItem({ id: product.id, name: product.title, price: product.price, image: product.image, category: product.department }, existing?.quantity ?? 1);
    if (existing) { this.cart.removeItem(existing.id); this.replaced = true; }
    this.added = product.id;
  }
}

