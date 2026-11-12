import { CATALOG, CatalogFilters, DEPARTMENTS, filterCatalog } from './catalog';

describe('Grocery catalog filters', () => {
  it('provides a full six-product beverage row with unique cart identifiers and working department filters', () => {
    const beverages = CATALOG.filter(p => p.department === 'drinks');
    expect(beverages.length).toBeGreaterThanOrEqual(6);
    expect(new Set(beverages.map(p => p.id)).size).toBe(beverages.length);
    expect(beverages.every(p => p.oldPrice >= p.price && p.image.startsWith('assets/'))).toBeTrue();
  });
  it('reads rupee prefixes and thousands separators without treating the prefix dot as a decimal', () => {
    expect(CATALOG.find(p => p.id === 'rec-pk-sabzi-greens')!.price).toBe(480);
    expect(CATALOG.find(p => p.id === 'rec-pk-basmati-rice')!.price).toBe(1180);
    expect(CATALOG.find(p => p.id === 'frozen-pk-paratha')!.price).toBe(540);
  });
  const defaults: CatalogFilters = { category: '', brands: [], min: 0, max: 3000, q: '', sort: 'popular', offers: false };
  it('keeps unique cart identifiers and valid local products for every department', () => {
    expect(new Set(CATALOG.map(p => p.id)).size).toBe(CATALOG.length);
    DEPARTMENTS.forEach(d => expect(CATALOG.some(p => p.department === d.id)).toBeTrue());
    CATALOG.forEach(p => { expect(p.price).toBeGreaterThan(0); expect(p.image).not.toContain('product-two'); });
  });
  it('combines category, brand, price and search rather than filtering independently', () => {
    const target = CATALOG.find(p => p.id === 'rec-pk-bakery-box')!;
    const result = filterCatalog(CATALOG, { ...defaults, category: 'bakery', brands: [target.brand], min: target.price, max: target.price, q: 'artisan bread' });
    expect(result.map(p => p.id)).toEqual([target.id]);
    expect(filterCatalog(CATALOG, { ...defaults, category: 'meats', brands: [target.brand] })).toEqual([]);
  });
  it('sorts numerically without mutating the shared homepage catalog', () => {
    const before = CATALOG.map(p => p.id);
    const result = filterCatalog(CATALOG, { ...defaults, sort: 'price-asc' });
    expect(result.every((p, i) => !i || p.price >= result[i - 1].price)).toBeTrue();
    expect(CATALOG.map(p => p.id)).toEqual(before);
  });
});
