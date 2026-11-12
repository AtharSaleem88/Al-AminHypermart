import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss']
})
export class BottomNavComponent {
  isSearchModalOpen: boolean = false;
  searchQuery: string = '';

  popularSearches = [
    'Fresh Milk',
    'Farm Eggs',
    'Basmati Rice',
    'Olive Oil',
    'Bananas',
    'Chicken Breast',
    'Bakery Bread'
  ];

  constructor(public router: Router, public cartService: CartService) {}

  openSearch(): void {
    this.isSearchModalOpen = true;
    document.body.classList.add('overflow-hidden');
  }

  closeSearch(): void {
    this.isSearchModalOpen = false;
    document.body.classList.remove('overflow-hidden');
  }

  onSearchSubmit(): void {
    if (this.searchQuery.trim()) {
      const term = this.searchQuery.trim();
      this.closeSearch();
      this.router.navigate(['/shop'], { queryParams: { q: term } });
    }
  }

  selectPopularSearch(term: string): void {
    this.searchQuery = term;
    this.onSearchSubmit();
  }

  isRouteActive(route: string): boolean {
    if (route === '/') {
      return this.router.url === '/' || this.router.url === '';
    }
    return this.router.url.startsWith(route);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isSearchModalOpen) {
      this.closeSearch();
    }
  }
}
