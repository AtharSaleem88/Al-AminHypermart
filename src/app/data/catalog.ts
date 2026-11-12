import { LANDING_ESSENTIALS, LANDING_RECOMMENDED, LANDING_FROZEN } from './landing-products';

export interface CatalogProduct {
  id: string; title: string; image: string; price: number; oldPrice: number;
  department: string; brand: string; rating: number;
}

export const DEPARTMENTS = [
  { id: 'vegetables', name: 'Vegetables', image: 'cat-vegetables.png' },
  { id: 'fruits', name: 'Fresh Fruits', image: 'cat-fruits.png' },
  { id: 'meats', name: 'Halal Meats', image: 'cat-meats.png' },
  { id: 'dairy', name: 'Dairy & Eggs', image: 'cat-dairy.png' },
  { id: 'bakery', name: 'Bakery & Breads', image: 'cat-bakery.png' },
  { id: 'drinks', name: 'Drinks & Juices', image: 'cat-drinks.png' },
  { id: 'seafood', name: 'Fresh Seafood', image: 'cat-seafood.png' },
  { id: 'snacks', name: 'Snacks & Treats', image: 'cat-snacks.png' },
  { id: 'pantry', name: 'Pantry Staples', image: 'cat-pantry.png' },
  { id: 'organic', name: 'Organic Foods', image: 'cat-organic.png' },
  { id: 'frozen', name: 'Frozen & Ready to Cook', image: 'pk-frozen-paratha.jpg' },
];

function amount(value: string | number): number {
  return Number(String(value).replace(/,/g, '').match(/\d+(?:\.\d+)?/)?.[0] ?? 0);
}
function department(id: string): string {
  if (/frozen/.test(id)) return 'frozen';
  if (/sabzi|greens/.test(id)) return 'vegetables';
  if (/milk|dairy|makkhan/.test(id)) return 'dairy';
  if (/bakery/.test(id)) return 'bakery';
  if (/kinnow|tea/.test(id)) return 'drinks';
  if (/snacks/.test(id)) return 'snacks';
  if (/surmai/.test(id)) return 'seafood';
  if (/orchard/.test(id)) return 'fruits';
  if (/halal-meats/.test(id)) return 'meats';
  if (/organic|honey/.test(id)) return 'organic';
  return 'pantry';
}

// Share the homepage's products and cart identifiers; no placeholder inventory.
export const CATALOG: CatalogProduct[] = [
  // Beverage pack variants for the storefront's local demonstration catalog.
  { id: 'beverage-kinnow-250ml', title: 'Sargodha Fresh Kinnow Orange Juice 250ml', image: 'assets/images/thumbs/cat-drinks.jpg', price: 140, oldPrice: 170, department: 'drinks', brand: 'Al-Amin Orchard', rating: 4.8 },
  { id: 'beverage-kinnow-500ml', title: 'Sargodha Fresh Kinnow Orange Juice 500ml', image: 'assets/images/thumbs/cat-drinks.jpg', price: 250, oldPrice: 300, department: 'drinks', brand: 'Al-Amin Orchard', rating: 4.8 },
  { id: 'beverage-danedar-450g', title: 'Strong Danedar Black Tea 450g', image: 'assets/images/thumbs/pk-danedar-tea.jpg', price: 720, oldPrice: 820, department: 'drinks', brand: 'Al-Amin Hypermart', rating: 4.8 },
  { id: 'beverage-full-cream-milk-1l', title: 'Full Cream Fresh Dairy Milk 1L', image: 'assets/images/thumbs/pk-dairy-milk.jpg', price: 290, oldPrice: 330, department: 'drinks', brand: 'Al-Amin Fresh Dairy', rating: 4.9 },
  ...LANDING_RECOMMENDED.map(p => ({
    id: p.id, title: p.title, image: p.image, price: amount(p.price),
    oldPrice: amount(p.originalPrice), department: department(p.id), brand: p.store, rating: p.rating,
  })),
  ...LANDING_ESSENTIALS.map(p => ({
    id: p.id, title: p.name, image: p.image, price: p.price, oldPrice: p.oldPrice,
    department: department(p.id), brand: 'Al-Amin Hypermart', rating: p.rating,
  })),
  ...LANDING_FROZEN.map(p => ({
    id: p.id, title: p.title, image: p.image, price: amount(p.price),
    oldPrice: amount(p.originalPrice), department: 'frozen', brand: 'Al-Amin Frozen', rating: 4.8,
  })),
];

export interface CatalogFilters {
  category: string; brands: string[]; min: number; max: number; q: string; sort: string; offers: boolean;
}
export function filterCatalog(products: CatalogProduct[], filters: CatalogFilters): CatalogProduct[] {
  const words = filters.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const result = products.filter(p =>
    (!filters.category || p.department === filters.category) &&
    (!filters.brands.length || filters.brands.includes(p.brand)) &&
    p.price >= filters.min && p.price <= filters.max &&
    (!filters.offers || p.oldPrice > p.price) &&
    words.every(word => `${p.title} ${p.brand} ${p.department}`.toLowerCase().includes(word))
  );
  if (filters.sort === 'price-asc') result.sort((a, b) => a.price - b.price);
  else if (filters.sort === 'price-desc') result.sort((a, b) => b.price - a.price);
  else if (filters.sort === 'name') result.sort((a, b) => a.title.localeCompare(b.title));
  else result.sort((a, b) => b.rating - a.rating);
  return result;
}
