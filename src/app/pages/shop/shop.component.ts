import { Component, DestroyRef, inject, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CATALOG, DEPARTMENTS, CatalogFilters, filterCatalog } from '../../data/catalog';
import { ProductCardComponent } from '../../component/product-card/product-card.component';

@Component({
  selector: 'app-shop', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ProductCardComponent],
  templateUrl: './shop.component.html', styleUrl: './shop.component.scss',
})
export class ShopComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly departments = DEPARTMENTS;
  readonly products = CATALOG;
  readonly brands = [...new Set(CATALOG.map(p => p.brand))].sort();
  readonly pageSize = 12;
  category = ''; selectedBrands: string[] = []; min = 0; max = 3000;
  search = ''; sort = 'popular'; offers = false; page = 1;
  draftMin = 0; draftMax = 3000; searchDraft = '';

  filtersOpen = true;
  mobileFiltersOpen = false;
  @ViewChild('filterDialog') filterDialog!: ElementRef<HTMLDialogElement>;
  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const category = params.get('category') ?? '';
      this.category = this.departments.some(d => d.id === category) ? category : '';
      this.selectedBrands = (params.get('brand') ?? '').split(',').filter(b => this.brands.includes(b));
      this.min = this.number(params.get('min'), 0);
      this.max = Math.max(this.min, this.number(params.get('max'), 3000));
      this.search = params.get('q') ?? '';
      this.sort = ['price-asc', 'price-desc', 'name'].includes(params.get('sort') ?? '') ? params.get('sort')! : 'popular';
      this.offers = params.get('offers') === '1' || params.get('filter') === 'offers';
      this.page = Math.min(this.totalPages, Math.max(1, Math.floor(this.number(params.get('page'), 1))));
      this.draftMin = this.min; this.draftMax = this.max; this.searchDraft = this.search;
    });
  }
  get refinementCount(): number { return this.selectedBrands.length + Number(this.min > 0 || this.max !== 3000) + Number(this.offers); }
  openFilters(): void {
    this.filterDialog.nativeElement.showModal();
    this.mobileFiltersOpen = true;
  }
  onFilterBackdropClick(event: MouseEvent): void {
    if (event.target === this.filterDialog.nativeElement) this.closeFilters();
  }
  closeFilters(): void {
    this.filterDialog.nativeElement.close();
    this.mobileFiltersOpen = false;
  }
  finishFilters(): void {
    this.applyPrice();
    this.closeFilters();
  }
  @HostListener('window:resize') onResize(): void {
    if (this.mobileFiltersOpen && window.innerWidth > 991) this.closeFilters();
  }
  private number(value: string | null, fallback: number): number {
    const n = value === null || value.trim() === '' ? NaN : Number(value);
    return Number.isFinite(n) && n >= 0 ? n : fallback;
  }
  get filters(): CatalogFilters { return { category: this.category, brands: this.selectedBrands, min: this.min, max: this.max, q: this.search, sort: this.sort, offers: this.offers }; }
  get filteredProducts() { return filterCatalog(this.products, this.filters); }
  get totalPages() { return Math.max(1, Math.ceil(this.filteredProducts.length / this.pageSize)); }
  get visibleProducts() { return this.filteredProducts.slice((this.page - 1) * this.pageSize, this.page * this.pageSize); }
  get title() { return this.departments.find(d => d.id === this.category)?.name ?? 'All departments'; }
  get resultStart() { return this.filteredProducts.length ? (this.page - 1) * this.pageSize + 1 : 0; }
  get resultEnd() { return Math.min(this.page * this.pageSize, this.filteredProducts.length); }
  get hasFilters() { return !!(this.category || this.selectedBrands.length || this.search || this.offers || this.min || this.max !== 3000); }
  countDepartment(id: string) { return this.products.filter(p => p.department === id).length; }
  countBrand(name: string) { return this.products.filter(p => (!this.category || p.department === this.category) && p.brand === name).length; }
  update(params: Record<string, string | number | null>): void {
    void this.router.navigate(['/shop'], { queryParams: { ...params, page: null }, queryParamsHandling: 'merge' });
  }
  chooseDepartment(id: string): void { this.update({ category: id || null, brand: null }); }
  toggleBrand(brand: string): void {
    const next = this.selectedBrands.includes(brand) ? this.selectedBrands.filter(b => b !== brand) : [...this.selectedBrands, brand];
    this.update({ brand: next.join(',') || null });
  }
  applyPrice(): void {
    const low = Math.max(0, Number(this.draftMin) || 0);
    const high = Math.max(0, Number(this.draftMax) || 0);
    this.update({ min: Math.min(low, high), max: Math.max(low, high) });
  }
  clear(): void { void this.router.navigate(['/shop']); }
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    void this.router.navigate(['/shop'], { queryParams: { page: page === 1 ? null : page }, queryParamsHandling: 'merge' });
  }
}
