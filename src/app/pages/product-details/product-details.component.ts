import { WishlistButtonComponent } from '../../component/wishlist-button/wishlist-button.component';
import { CATALOG } from '../../data/catalog';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Import this
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { BreadcrumbComponent } from '../../component/breadcrumb/breadcrumb.component';
import { CartService } from '../../services/cart.service';
import { SmileAddBtnComponent } from '../../component/smile-add-btn/smile-add-btn.component';


@Component({
  selector: 'app-product-details',
  imports: [WishlistButtonComponent,CommonModule,RouterLink,FormsModule,SlickCarouselModule,BreadcrumbComponent,SmileAddBtnComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {
  readonly cartService = inject(CartService);
  productThumbSlider = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: '.product-details__images-slider'
  };

  productImageSlider = {
    slidesToShow: 4,
    slidesToScroll: 1,
    asNavFor: '.product-details__thumb-slider',
    dots: false,
    arrows: false,
    focusOnSelect: true
  };
  thumbs = [
    'assets/images/thumbs/product-details-thumb1.png',
    'assets/images/thumbs/product-details-thumb2.png',
    'assets/images/thumbs/product-details-thumb3.png',
    'assets/images/thumbs/product-details-thumb1.png',
    'assets/images/thumbs/product-details-thumb2.png',
  ];

  images = [
    'assets/images/thumbs/product-details-img1.png',
    'assets/images/thumbs/product-details-img2.png',
    'assets/images/thumbs/product-details-img3.png',
    'assets/images/thumbs/product-details-img1.png',
    'assets/images/thumbs/product-details-img2.png',
  ];

  products = CATALOG.slice(0,7).map((p,i)=>({...p,name:p.title,reviews:120,fadeDuration:200+i*80,productLink:'/shop/product/'+p.id}));

  arrivalSlider = {
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
    speed: 1500,
    dots: false,
    pauseOnHover: true,
    arrows: true,
    draggable: true,
    infinite: false,
    nextArrow: '#new-arrival-next',
    prevArrow: '#new-arrival-prev',
    responsive: [
      {
        breakpoint: 1599,
        settings: {
          slidesToShow: 6,
          arrows: false,
        }
      },
      {
        breakpoint: 1399,
        settings: {
          slidesToShow: 4,
          arrows: false,
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          arrows: false,
        }
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 2,
          arrows: false,
        }
      },
      {
        breakpoint: 424,
        settings: {
          slidesToShow: 1,
          arrows: false,
        }
      },
    ]
  }

  addMainProductToCart(): void {
    this.cartService.addItem(
      {
        id: 'lays-potato-chips-onion-flavored',
        name: "Lay's Potato Chips Onion Flavored",
        category: 'Snacks & Pantry',
        price: 25.0,
        image: 'assets/images/thumbs/product-details-img1.png',
        rating: 4.7,
        reviewsCount: 21671,
      },
      1
    );
  }

  addRelatedToCart(product: any): void {
    this.cartService.addItem({
      id: product.id,
      name: product.name,
      category: 'Al-Amin Fresh',
      price: product.price,
      image: product.image,
      rating: Number(product.rating) || 4.8,
      reviewsCount: parseInt(String(product.reviews ?? 120), 10) || 120,
    });
  }
}
