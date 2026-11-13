import { Injectable, afterNextRender, computed, inject, signal } from '@angular/core';
import { CATALOG, findCatalogProduct } from '../data/catalog';
import { AccountService } from './account.service';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly account = inject(AccountService);
  private readonly saved = signal<Record<string, string[]>>({});
  private readonly scope = computed(() => this.account.user()?.id ?? 'guest');
  readonly products = computed(() => CATALOG.filter(product =>
    (this.saved()[this.scope()] ?? []).includes(product.id)));

  constructor() {
    afterNextRender(() => {
      try {
        const data = JSON.parse(localStorage.getItem('al_amin_wishlist_v1') ?? '{}');
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          const valid: Record<string, string[]> = {};
          for (const [key, value] of Object.entries(data)) {
            if (Array.isArray(value)) {
              valid[key] = value.filter((id): id is string =>
                typeof id === 'string' && CATALOG.some(product => product.id === id));
            }
          }
          this.saved.set(valid);
        }
      } catch {
        // Storage can be disabled; saving still works for the current visit.
      }
    });
  }

  isSaved(id?: string | number, name = ''): boolean {
    const product = findCatalogProduct(id, name);
    return !!product && (this.saved()[this.scope()] ?? []).includes(product.id);
  }

  toggle(id?: string | number, name = ''): void {
    const product = findCatalogProduct(id, name);
    if (!product) return;
    const ids = this.saved()[this.scope()] ?? [];
    this.saved.update(saved => ({ ...saved, [this.scope()]: ids.includes(product.id)
      ? ids.filter(id => id !== product.id) : [...ids, product.id] }));
    try {
      localStorage.setItem('al_amin_wishlist_v1', JSON.stringify(this.saved()));
    } catch {
      // Retain the in-memory wishlist when browser storage is unavailable.
    }
  }
}
