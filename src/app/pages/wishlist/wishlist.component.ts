import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '../../component/breadcrumb/breadcrumb.component';
import { CartService } from '../../services/cart.service';
import { SmileAddBtnComponent } from '../../component/smile-add-btn/smile-add-btn.component';



@Component({
  selector: 'app-wishlist',
  imports: [CommonModule,RouterLink,BreadcrumbComponent,SmileAddBtnComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit {
  readonly cartService = inject(CartService);
  products = [
    {
      id: 'wishlist-1',
      image: 'assets/images/thumbs/product-two-img1.png',
      productLink: 'product-details',
      productName: 'Taylor Farms Broccoli Florets Vegetables',
      rating: 4.8,
      reviews: 128,
      price: '$125.00',
      stockStatus: 'In Stock',
      cartLink: 'cart'
    },
    {
      id: 'wishlist-2',
      image: 'assets/images/thumbs/product-two-img3.png',
      productLink: 'product-details',
      productName: 'Smart Phone With Intel Celeron',
      rating: 4.8,
      reviews: 128,
      price: '$125.00',
      stockStatus: 'In Stock',
      cartLink: 'cart'
    },
    {
      id: 'wishlist-3',
      image: 'assets/images/thumbs/product-two-img14.png',
      productLink: 'product-details',
      productName: 'HP Chromebook With Intel Celeron',
      rating: 4.8,
      reviews: 128,
      price: '$125.00',
      stockStatus: 'In Stock',
      cartLink: 'cart'
    },
    {
      id: 'wishlist-4',
      image: 'assets/images/thumbs/product-two-img2.png',
      productLink: 'product-details',
      productName: 'Smart Watch With Intel Celeron',
      rating: 4.8,
      reviews: 128,
      price: '$125.00',
      stockStatus: 'In Stock',
      cartLink: 'cart'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  addToCart(product: any): void {
    this.cartService.addItem({
      id: product.id,
      name: product.productName,
      category: 'Wishlist Item',
      price: product.price,
      image: product.image,
      rating: Number(product.rating) || 4.8,
      reviewsCount: Number(product.reviews) || 120,
    });
  }
}
