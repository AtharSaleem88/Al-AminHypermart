import { Component, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface SuggestionProduct {
  name: string;
  category: string;
  price: string;
  image: string;
}

@Component({
  selector: 'app-secondheader',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, ReactiveFormsModule, RouterLinkActive],
  templateUrl: './secondheader.component.html',
  styleUrl: './secondheader.component.scss'
})
export class SecondheaderComponent {
  isBrowser: boolean = false;
  searchTerm: string = '';
  isHomePageActive: boolean = false;
  isSearchModalOpen: boolean = false;
  categoryDropdownVisible: boolean = false;
  isMobileMenuActive: boolean = false;
  isCartSliderOpen: boolean = false;

  cartItems = [
    {
      id: 1,
      name: 'Organic Whole Milk 1L',
      category: 'Dairy & Eggs',
      price: 3.49,
      quantity: 1,
      image: 'assets/images/thumbs/product-img1.png'
    },
    {
      id: 2,
      name: 'Halal Fresh Chicken Breast 500g',
      category: 'Fresh Butchery',
      price: 6.89,
      quantity: 1,
      image: 'assets/images/thumbs/product-img6.png'
    }
  ];

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

  sampleProducts: SuggestionProduct[] = [
    { name: 'Organic Whole Milk 1L', category: 'Dairy & Eggs', price: '$3.49', image: 'assets/images/thumbs/product-img1.png' },
    { name: 'Farm Fresh Grade A Eggs 12pk', category: 'Dairy & Eggs', price: '$4.99', image: 'assets/images/thumbs/product-img2.png' },
    { name: 'Premium Long Grain Basmati Rice 5kg', category: 'Pantry Staples', price: '$14.99', image: 'assets/images/thumbs/product-img3.png' },
    { name: 'Cold Pressed Extra Virgin Olive Oil 750ml', category: 'Pantry Staples', price: '$9.99', image: 'assets/images/thumbs/product-img4.png' },
    { name: 'Fresh Cavendish Bananas 1kg', category: 'Fresh Produce', price: '$2.19', image: 'assets/images/thumbs/product-img5.png' },
    { name: 'Halal Fresh Chicken Breast Fillet 500g', category: 'Fresh Butchery', price: '$6.89', image: 'assets/images/thumbs/product-img6.png' }
  ];

  categorie = [
    { name: 'Fresh Vegetables', icon: 'assets/images/icon/category-1.png', route: '/shop' },
    { name: 'Dairy & Eggs', icon: 'assets/images/icon/category-2.png', route: '/shop' },
    { name: 'Pantry & Grocery', icon: 'assets/images/icon/category-3.png', route: '/shop' },
    { name: 'Health & Beauty', icon: 'assets/images/icon/category-4.png', route: '/shop' },
    { name: 'Beverages & Drinks', icon: 'assets/images/icon/category-5.png', route: '/shop' },
    { name: 'Snacks & Confectionery', icon: 'assets/images/icon/category-6.png', route: '/shop' },
    { name: 'Fresh Fruits', icon: 'assets/images/icon/category-8.png', route: '/shop' },
    { name: 'Tea & Coffee', icon: 'assets/images/icon/category-9.png', route: '/shop' }
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.isHomePageActive = this.router.url === '/';
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
    if (!target.closest('.category-dropdown-wrapper')) {
      this.categoryDropdownVisible = false;
    }
  }

  openCartSlider() {
    this.isCartSliderOpen = true;
    if (this.isBrowser) {
      document.body.classList.add('overflow-hidden');
    }
  }

  closeCartSlider() {
    this.isCartSliderOpen = false;
    if (this.isBrowser) {
      document.body.classList.remove('overflow-hidden');
    }
  }

  increaseQuantity(item: any) {
    item.quantity++;
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.removeItem(item);
    }
  }

  removeItem(item: any) {
    this.cartItems = this.cartItems.filter(i => i.id !== item.id);
  }

  get cartSubtotal(): number {
    return this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  get cartCount(): number {
    return this.cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isSearchModalOpen) {
      this.closeSearchModal();
    }
    if (this.isCartSliderOpen) {
      this.closeCartSlider();
    }
  }
}
