import { isProductAvailable } from '../data/catalog';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface CartItem {
  id: string;
  name: string;
  category: string;
  unitPrice: number;
  quantity: number;
  image: string;
  rating?: number;
  reviewsCount?: number;
}

export interface AddCartItemInput {
  id?: string | number;
  name: string;
  category?: string;
  price?: string | number;
  image?: string;
  rating?: number;
  reviewsCount?: number;
}

export interface CartToast {
  title: string;
  image: string;
  unitPrice: number;
}

const STORAGE_KEY = 'al_amin_cart_v1';

const DEFAULT_SAMPLE_CART: CartItem[] = [
  {
    id: 'organic-whole-milk-1l',
    name: 'Organic Whole Milk 1L',
    category: 'Dairy & Eggs',
    unitPrice: 450,
    quantity: 1,
    image: 'assets/images/thumbs/cat-dairy.jpg',
    rating: 4.8,
    reviewsCount: 128,
  },
  {
    id: 'halal-fresh-chicken-breast-500g',
    name: 'Halal Fresh Chicken Breast Fillet 500g',
    category: 'Fresh Butchery',
    unitPrice: 1000,
    quantity: 1,
    image: 'assets/images/thumbs/cat-meats.jpg',
    rating: 4.9,
    reviewsCount: 94,
  },
];

@Injectable({
  providedIn: 'root',
})
export class CartService {
  readonly MINIMUM_ORDER_RS = 3000;

  readonly QUICK_ADD_ESSENTIALS: ReadonlyArray<{
    id: string;
    name: string;
    category: string;
    unitPrice: number;
    image: string;
  }> = [
    {
      id: 'quick-farm-eggs-12pk',
      name: 'Artisan Multigrain Bread Loaf',
      category: 'Bakery & Breads',
      unitPrice: 380,
      image: 'assets/images/thumbs/cat-bakery.jpg',
    },
    {
      id: 'quick-basmati-rice-5kg',
      name: 'Super Kernel Basmati Rice 5kg',
      category: 'Pantry & Staples',
      unitPrice: 1450,
      image: 'assets/images/thumbs/cat-pantry.jpg',
    },
    {
      id: 'quick-olive-oil-750ml',
      name: 'Organic Fresh Vegetable Basket',
      category: 'Fresh Produce',
      unitPrice: 1250,
      image: 'assets/images/thumbs/cat-vegetables.jpg',
    },
  ];

  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly _items = signal<CartItem[]>(this.loadInitialItems());
  readonly items = this._items.asReadonly();

  readonly isDrawerOpen = signal<boolean>(false);
  readonly toast = signal<CartToast | null>(null);

  readonly itemCount = computed(() =>
    this._items().reduce((total, item) => total + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this._items().reduce((total, item) => total + item.unitPrice * item.quantity, 0)
  );

  readonly remainingAmount = computed(() =>
    Math.max(0, this.MINIMUM_ORDER_RS - this.subtotal())
  );

  readonly progressPercent = computed(() => {
    const pct = (this.subtotal() / this.MINIMUM_ORDER_RS) * 100;
    return Math.min(100, Math.max(0, Math.round(pct * 10) / 10));
  });

  readonly unavailableItems = computed(() => this._items().filter(item => !isProductAvailable(item.id, item.name)));
  readonly isMinimumMet = computed(() => this.subtotal() >= this.MINIMUM_ORDER_RS);

  addItem(input: AddCartItemInput, quantity: number = 1): void {
    if (!isProductAvailable(input.id, input.name)) return;
    const safeQty = Math.max(1, Math.floor(Number(quantity) || 1));
    const unitPrice = this.parsePriceToRs(input.price);
    const id = this.resolveItemId(input.id, input.name);
    const image = input.image || 'assets/images/thumbs/cat-pantry.jpg';

    this._items.update((current) => {
      const existingIndex = current.findIndex((item) => item.id === id);
      if (existingIndex > -1) {
        return current.map((item, idx) =>
          idx === existingIndex
            ? { ...item, name: input.name, unitPrice, image, quantity: item.quantity + safeQty }
            : item
        );
      }

      return [
        ...current,
        {
          id,
          name: input.name,
          category: input.category || 'Al-Amin Fresh',
          unitPrice,
          quantity: safeQty,
          image,
          rating: input.rating ?? 4.8,
          reviewsCount: input.reviewsCount ?? 120,
        },
      ];
    });

    this.persistItems();
    this.showToast({
      title: input.name,
      image,
      unitPrice,
    });
  }

  increaseQuantity(id: string): void {
    const currentItem = this._items().find(item => item.id === id);
    if (currentItem && !isProductAvailable(id, currentItem.name)) return;
    this._items.update((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
    this.persistItems();
    const item = this._items().find((entry) => entry.id === id);
    if (item) {
      this.showToast({ title: item.name, image: item.image, unitPrice: item.unitPrice });
    }
  }

  decreaseQuantity(id: string): void {
    this._items.update((current) => {
      const target = current.find((item) => item.id === id);
      if (!target) {
        return current;
      }
      if (target.quantity <= 1) {
        return current.filter((item) => item.id !== id);
      }
      return current.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
    this.persistItems();
  }

  updateQuantity(id: string, quantity: number): void {
    const parsed = Math.floor(Number(quantity));
    if (!Number.isFinite(parsed) || parsed <= 0) {
      this.removeItem(id);
      return;
    }

    this._items.update((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: parsed } : item
      )
    );
    this.persistItems();
  }

  removeItem(id: string): void {
    this._items.update((current) => current.filter((item) => item.id !== id));
    this.persistItems();
  }

  clearCart(): void {
    this._items.set([]);
    this.dismissToast();
    this.persistItems();
  }

  resetSampleCart(): void {
    this._items.set(DEFAULT_SAMPLE_CART.map((item) => ({ ...item })));
    this.persistItems();
  }

  openDrawer(): void {
    this.isDrawerOpen.set(true);
    if (this.isBrowser) {
      document.body.classList.add('overflow-hidden');
    }
  }

  closeDrawer(): void {
    this.isDrawerOpen.set(false);
    if (this.isBrowser) {
      document.body.classList.remove('overflow-hidden');
    }
  }

  dismissToast(): void {
    this.toast.set(null);
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
      this.toastTimer = null;
    }
  }

  parsePriceToRs(value: string | number | undefined): number {
    if (value === undefined || value === null || value === '') {
      return 450;
    }

    if (typeof value === 'number') {
      if (!Number.isFinite(value) || value <= 0) {
        return 450;
      }
      if (value >= 100) {
        return Math.round(value);
      }
      return Math.max(50, Math.round((value * 50) / 10) * 10);
    }

    const trimmed = value.trim();
    const match = trimmed.replace(/,/g, '').match(/\d+(?:\.\d+)?/);
    const numeric = match ? parseFloat(match[0]) : NaN;
    if (!Number.isFinite(numeric) || numeric <= 0) {
      return 450;
    }

    const isExplicitRs = /(?:rs|pkr)/i.test(trimmed);
    if (isExplicitRs || numeric >= 200) {
      return Math.round(numeric);
    }

    if (numeric >= 100) {
      return Math.round(numeric * 10);
    }

    return Math.max(50, Math.round((numeric * 50) / 10) * 10);
  }

  formatRs(amount: number): string {
    return `Rs. ${Math.round(amount).toLocaleString('en-US')}`;
  }

  getItemQuantity(id?: string | number, name: string = ''): number {
    const resolvedId = this.resolveItemId(id, name);
    if (!resolvedId) {
      return 0;
    }
    return this._items().find((item) => item.id === resolvedId)?.quantity ?? 0;
  }

  resolveItemId(id: string | number | undefined, name: string): string {
    if (id !== undefined && id !== null && String(id).trim() !== '') {
      return String(id).trim();
    }
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private showToast(toast: CartToast): void {
    this.toast.set(toast);
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    if (this.isBrowser) {
      this.toastTimer = setTimeout(() => {
        this.toast.set(null);
        this.toastTimer = null;
      }, 4000);
    }
  }

  private loadInitialItems(): CartItem[] {
    if (!this.isBrowser) {
      return DEFAULT_SAMPLE_CART.map((item) => ({ ...item }));
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return DEFAULT_SAMPLE_CART.map((item) => ({ ...item }));
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return DEFAULT_SAMPLE_CART.map((item) => ({ ...item }));
      }
      return parsed
        .filter(
          (entry) =>
            entry &&
            typeof entry.id === 'string' &&
            typeof entry.name === 'string' &&
            Number.isFinite(Number(entry.unitPrice)) &&
            Number(entry.quantity) > 0
        )
        .map((entry) => ({
          id: entry.id,
          name: entry.name,
          category: typeof entry.category === 'string' ? entry.category : 'Al-Amin Fresh',
          unitPrice: Math.round(Number(entry.unitPrice)),
          quantity: Math.max(1, Math.floor(Number(entry.quantity))),
          image:
            typeof entry.image === 'string' && entry.image
              ? entry.image
              : 'assets/images/thumbs/product-img1.png',
          rating: typeof entry.rating === 'number' ? entry.rating : 4.8,
          reviewsCount: typeof entry.reviewsCount === 'number' ? entry.reviewsCount : 120,
        }));
    } catch {
      return DEFAULT_SAMPLE_CART.map((item) => ({ ...item }));
    }
  }

  private persistItems(): void {
    if (!this.isBrowser) {
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this._items()));
    } catch {
      // Ignore storage quota or private browsing errors
    }
  }
}
