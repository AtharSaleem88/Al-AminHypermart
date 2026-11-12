import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartItem } from './cart.service';
import { AccountService } from './account.service';

export interface OrderReceipt {
  id: string;
  createdAt: string;
  items: CartItem[];
  total: number;
  demo: true;
  accountId?: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly account = inject(AccountService);
  private readonly historyKey = 'al_amin_order_history_preview_v1';
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly storageKey = 'al_amin_demo_order_v1';

  // Front-end receipt only. Replace this method with the order API when connected.
  placeDemoOrder(key: string, items: CartItem[], minimum: number): OrderReceipt {
    if (!this.isBrowser) throw new Error('Order placement is only available in your browser.');
    const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    if (!items.length || total < minimum) throw new Error('Your basket no longer meets the minimum order.');
    const existing = this.lastReceipt();
    if (existing?.id === key) return existing;
    const receipt: OrderReceipt = {
      id: key, createdAt: new Date().toISOString(),
      items: items.map(item => ({ ...item })), total, demo: true, accountId: this.account.user()?.id,
    };
    // Save before clearing the basket; do not persist contact or delivery details.

    if (receipt.accountId) {
      localStorage.setItem(this.historyKey, JSON.stringify([...this.history().filter(order => order.id !== key), receipt]));
    }
    sessionStorage.setItem(this.storageKey, JSON.stringify(receipt));
    return receipt;
  }

  private history(): OrderReceipt[] {
    try {
      const value = JSON.parse(localStorage.getItem(this.historyKey) ?? '[]');
      return Array.isArray(value) ? value.filter(order => order?.demo === true && typeof order.id === 'string' && typeof order.accountId === 'string' && Array.isArray(order.items) && Number.isFinite(order.total)) : [];
    } catch { return []; }
  }
  accountHistory(): OrderReceipt[] {
    const id = this.account.user()?.id;
    return this.isBrowser && id ? this.history().filter(order => order.accountId === id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)) : [];
  }

  lastReceipt(): OrderReceipt | null {
    if (!this.isBrowser) return null;
    try {
      const value = JSON.parse(sessionStorage.getItem(this.storageKey) ?? 'null');
      return value?.demo === true && typeof value.id === 'string' && Array.isArray(value.items) && Number.isFinite(value.total) ? value : null;
    } catch { return null; }
  }
}

