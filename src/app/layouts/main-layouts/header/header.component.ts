import { AccountService } from '../../../services/account.service';
import { CATALOG, DEPARTMENTS } from '../../../data/catalog';
import { Component, ElementRef, Inject, OnInit, OnDestroy, ViewChild, PLATFORM_ID, HostListener, AfterViewInit } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartItem, CartService } from '../../../services/cart.service';
import { MinOrderProgressComponent } from '../../../component/min-order-progress/min-order-progress.component';

interface SuggestionProduct {
  name: string;
  category: string;
  price: string;
  image: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, ReactiveFormsModule, RouterLinkActive, MinOrderProgressComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('announcementBar') announcementBar?: ElementRef<HTMLElement>;
  @ViewChild('mainHeader') mainHeader?: ElementRef<HTMLElement>;
  isHeaderPinned = false;
  private announcementObserver?: ResizeObserver;
  @ViewChild('progressPath') progressPathRef!: ElementRef<SVGPathElement>;
  isActiveProgress: boolean = false;
  private pathLength!: number;

  activeIndex: any | null = null;
  windowWidth: number = 0;
  isBrowser: boolean = false;
  
  searchTerm: string = '';
  isHomePageActive: boolean = false;
  isSearchModalOpen: boolean = false;
  categoryDropdownVisible: boolean = false;
  isMobileMenuActive: boolean = false;

  selectedLanguage: string = 'English';
  selectedCurrency: string = 'USD';

  popularSearches: string[] = [
    'Fresh Milk',
    'Farm Eggs',
    'Basmati Rice',
    'Olive Oil',
    'Organic Bananas',
    'Chicken Breast',
    'Bakery Sourdough Bread'
  ];

  sampleProducts: SuggestionProduct[] = CATALOG.map(p => ({ name: p.title, category: DEPARTMENTS.find(d => d.id === p.department)?.name ?? '', price: 'Rs. ' + p.price.toLocaleString('en-US'), image: p.image }));

  categorie = DEPARTMENTS.map(d => ({ id: d.id, name: d.name, icon: 'assets/images/thumbs/' + d.image, route: '/shop' }));

  constructor(
    private host: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: any,
    private router: Router,
    public account: AccountService,
    public cartService: CartService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.windowWidth = window.innerWidth;
    }
  }

  async signOut(): Promise<void> { this.account.logout(); await this.router.navigateByUrl('/'); }

  ngOnInit() {
    this.isHomePageActive = this.router.url === '/';
  }

  ngAfterViewInit(): void {
    if (this.isBrowser && this.announcementBar) {
      const announcement = this.announcementBar.nativeElement;
      const updateOffset = () => {
        this.host.nativeElement.style.setProperty('--announcement-height', `${announcement.offsetHeight}px`);
        if (this.mainHeader) {
          this.host.nativeElement.style.setProperty('--header-height', `${this.mainHeader.nativeElement.offsetHeight}px`);
        }
      };
      updateOffset();
      this.announcementObserver = new ResizeObserver(updateOffset);
      this.announcementObserver.observe(announcement);
      if (this.mainHeader) this.announcementObserver.observe(this.mainHeader.nativeElement);
      this.onScroll();
    }
    if (this.isBrowser && this.progressPathRef) {
      this.setupPath();
      this.updateProgress();
    }
  }

  ngOnDestroy(): void {
    this.announcementObserver?.disconnect();
  }

  get filteredProducts(): SuggestionProduct[] {
    if (!this.searchTerm.trim()) {
      return [];
    }
    const q = this.searchTerm.toLowerCase().trim();
    return this.sampleProducts.filter(p =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }

  setupPath() {
    const path = this.progressPathRef.nativeElement;
    this.pathLength = path.getTotalLength();
    path.style.transition = path.style.webkitTransition = 'none';
    path.style.strokeDasharray = `${this.pathLength} ${this.pathLength}`;
    path.style.strokeDashoffset = this.pathLength.toString();
    path.getBoundingClientRect();
    path.style.transition = path.style.webkitTransition = 'stroke-dashoffset 10ms linear';
  }

  @HostListener('window:scroll')
  onScroll() {
    if (this.isBrowser) {
      this.isHeaderPinned = window.scrollY > (this.announcementBar?.nativeElement.offsetHeight ?? 38);
    }
    if (this.isBrowser && this.progressPathRef) {
      this.updateProgress();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      this.isActiveProgress = scrollTop > 50;
    }
  }

  updateProgress() {
    const scroll = window.pageYOffset || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = this.pathLength - (scroll * this.pathLength / height);
    this.progressPathRef.nativeElement.style.strokeDashoffset = progress.toString();
  }

  scrollToTop(event: Event) {
    event.preventDefault();
    if (this.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  openMobileMenu() {
    this.isMobileMenuActive = true;
    if (this.isBrowser) {
      document.body.classList.add('scroll-hide-sm');
    }
  }

  closeMobileMenu() {
    this.isMobileMenuActive = false;
    if (this.isBrowser) {
      document.body.classList.remove('scroll-hide-sm');
    }
  }

  openSearchModal() {
    this.isSearchModalOpen = true;
    if (this.isBrowser) {
      document.body.classList.add('overflow-hidden');
    }
  }

  closeSearchModal() {
    this.isSearchModalOpen = false;
    if (this.isBrowser) {
      document.body.classList.remove('overflow-hidden');
    }
  }

  selectSearchTerm(term: string) {
    this.searchTerm = term;
    this.onSearchSubmit();
  }

  onSearchSubmit() {
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.trim();
      this.closeSearchModal();
      this.router.navigate(['/shop'], { queryParams: { q: term } });
    }
  }

  toggleCategoryDropdown() {
    this.categoryDropdownVisible = !this.categoryDropdownVisible;
  }

  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.header-account')) { const menu = this.host.nativeElement.querySelector<HTMLDetailsElement>('.header-account'); if (menu) menu.open = false; }
    if (!target.closest('.category-dropdown-wrapper')) {
      this.categoryDropdownVisible = false;
    }
  }

  get isCartSliderOpen(): boolean {
    return this.cartService.isDrawerOpen();
  }

  get cartItems(): CartItem[] {
    return this.cartService.items();
  }

  openCartSlider() {
    this.cartService.openDrawer();
  }

  closeCartSlider() {
    this.cartService.closeDrawer();
  }

  increaseQuantity(item: CartItem) {
    this.cartService.increaseQuantity(item.id);
  }

  decreaseQuantity(item: CartItem) {
    this.cartService.decreaseQuantity(item.id);
  }

  removeItem(item: CartItem) {
    this.cartService.removeItem(item.id);
  }

  get cartSubtotal(): number {
    return this.cartService.subtotal();
  }

  get cartCount(): number {
    return this.cartService.itemCount();
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    const menu = this.host.nativeElement.querySelector<HTMLDetailsElement>('.header-account'); if (menu) menu.open = false;
    if (this.isSearchModalOpen) {
      this.closeSearchModal();
    }
    if (this.isCartSliderOpen) {
      this.closeCartSlider();
    }
  }
}


