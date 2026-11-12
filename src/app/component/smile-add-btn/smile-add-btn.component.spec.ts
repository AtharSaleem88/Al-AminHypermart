import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { SmileAddBtnComponent } from './smile-add-btn.component';
import { CartService } from '../../services/cart.service';

describe('Product card cart control', () => {
  it('shows one action and synchronizes add, increment, decrement and removal across cards', () => {
    const quantity = signal(0);
    TestBed.configureTestingModule({
      imports: [SmileAddBtnComponent],
      providers: [{ provide: CartService, useValue: {
        getItemQuantity: () => quantity(),
        resolveItemId: () => 'test-product',
        increaseQuantity: () => quantity.update(value => value + 1),
        decreaseQuantity: () => quantity.update(value => Math.max(0, value - 1)),
      } }],
    });
    const cards = [TestBed.createComponent(SmileAddBtnComponent), TestBed.createComponent(SmileAddBtnComponent)];
    for (const card of cards) {
      document.body.appendChild(card.nativeElement);
      card.componentRef.setInput('itemId', 'test-product');
      card.componentRef.setInput('itemName', 'Test product');
      card.componentInstance.add.subscribe(() => quantity.update(value => value + 1));
    }
    const check = (expected: number) => {
      for (const card of cards) {
        card.detectChanges();
        const root: HTMLElement = card.nativeElement;
        const add = root.querySelector<HTMLElement>('.simple-add-btn')!;
        const control = root.querySelector<HTMLElement>('.simple-qty-control')!;
        expect(getComputedStyle(add).display === 'none').toBe(expected > 0);
        expect(getComputedStyle(control).display === 'none').toBe(expected === 0);
        expect(root.querySelector('.simple-qty-control__count')!.textContent!.trim()).toBe(String(expected));
      }
    };
    const click = (index: number, selector: string) => cards[index].nativeElement.querySelector(selector).click();
    check(0);
    click(0, '.simple-add-btn');
    check(1);
    click(1, '.simple-qty-control__btn--plus');
    check(2);
    click(0, '.simple-qty-control__btn--minus');
    check(1);
    click(1, '.simple-qty-control__btn--minus');
    check(0);
    // Cart drawer updates and persisted quantities use the same source of truth.
    quantity.set(3);
    check(3);
    quantity.set(0);
    check(0);
    cards.forEach(card => card.destroy());
  });
});
