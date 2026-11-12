import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { ShopComponent } from './shop.component';

describe('Shop routes and filters', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([{path: 'shop', component: ShopComponent}])] }));
  it('restores department and price sorting from a direct URL', async () => {
    const harness = await RouterTestingHarness.create();
    const shop = await harness.navigateByUrl('/shop?category=frozen&sort=price-asc', ShopComponent);
    expect(shop.title).toBe('Frozen & Ready to Cook');
    expect(shop.visibleProducts.every(p => p.department === 'frozen')).toBeTrue();
    expect(shop.visibleProducts[0].price).toBeLessThanOrEqual(shop.visibleProducts[1].price);
    expect(harness.routeNativeElement!.querySelectorAll('app-product-card').length).toBe(shop.visibleProducts.length);
  });
  it('handles filter changes and subsequent browser-style navigation on the same route', async () => {
    const harness = await RouterTestingHarness.create();
    const shop = await harness.navigateByUrl('/shop?category=bakery', ShopComponent);
    shop.toggleBrand('Al-Amin Bakehouse');
    await TestBed.inject(Router).navigateByUrl('/shop?category=bakery&brand=Al-Amin%20Bakehouse');
    expect(shop.selectedBrands).toEqual(['Al-Amin Bakehouse']);
    expect(shop.filteredProducts.length).toBe(1);
    await harness.navigateByUrl('/shop?category=fruits');
    expect(shop.selectedBrands).toEqual([]);
    expect(shop.visibleProducts.every(p => p.department === 'fruits')).toBeTrue();
  });
  it('clamps invalid page/price values and shows an honest empty state', async () => {
    const harness = await RouterTestingHarness.create();
    const shop = await harness.navigateByUrl('/shop?category=bogus&page=999&min=-20&max=nope', ShopComponent);
    expect(shop.category).toBe(''); expect(shop.min).toBe(0); expect(shop.max).toBe(3000);
    expect(shop.page).toBe(shop.totalPages);
    await harness.navigateByUrl('/shop?q=not-a-real-product');
    expect(shop.resultStart).toBe(0); expect(shop.visibleProducts.length).toBe(0);
    expect(harness.routeNativeElement!.textContent).toContain('No products match just yet');
  });
});