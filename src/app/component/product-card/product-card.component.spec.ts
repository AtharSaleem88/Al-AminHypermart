import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProductCardComponent } from './product-card.component';
import { CATALOG } from '../../data/catalog';

describe('Consistent catalogue cards', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [ProductCardComponent], providers: [provideRouter([])] }));
  it('shows one top stock label and retains the alternatives action', () => {
    const fixture = TestBed.createComponent(ProductCardComponent);
    fixture.componentRef.setInput('product', CATALOG.find(p => p.inStock === false)!);
    fixture.detectChanges();
    const card: HTMLElement = fixture.nativeElement;
    expect(card.querySelectorAll('.stock-badge').length).toBe(1);
    expect(card.querySelector('.stock-label')).toBeNull();
    expect(card.querySelector('.alternatives-toggle')?.textContent).toContain('See alternatives');
    fixture.destroy();
  });
  it('keeps the full title available and links to the correct product', () => {
    const fixture = TestBed.createComponent(ProductCardComponent);
    const product = CATALOG.find(p => p.inStock !== false)!;
    fixture.componentRef.setInput('product', product);
    fixture.detectChanges();
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('h3 a');
    expect(link.title).toBe(product.title);
    expect(link.getAttribute('href')).toBe('/shop/product/' + product.id);
    expect(fixture.nativeElement.querySelector('.stock-badge')).toBeNull();
    fixture.destroy();
  });
});
