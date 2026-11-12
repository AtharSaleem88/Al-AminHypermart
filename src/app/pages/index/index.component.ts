import { CATALOG, DEPARTMENTS } from '../../data/catalog';
import { ProductCardComponent } from '../../component/product-card/product-card.component';
import { LANDING_ESSENTIALS, LANDING_RECOMMENDED, LANDING_FROZEN } from '../../data/landing-products';
import { Component, OnDestroy, afterNextRender, inject } from '@angular/core';
import * as AOS from 'aos';
import { CommonModule } from '@angular/common'; // ✅ Import this
import { NgFor } from '@angular/common'; // (Optional: For tree-shaking optimization)
// Import your library
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { SmileAddBtnComponent } from '../../component/smile-add-btn/smile-add-btn.component';

@Component({
  selector: 'app-index',
  imports: [CommonModule, SlickCarouselModule, RouterLink, SmileAddBtnComponent, ProductCardComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent implements OnDestroy {
  readonly cartService = inject(CartService);
  readonly beverageProducts = CATALOG.filter(product => product.department === 'drinks').slice(0, 6);

  private bannerResizeObserver?: ResizeObserver;

  constructor() {
    // Refresh section reveals after Angular has rendered the routed home page.
    afterNextRender(() => AOS.refreshHard());
  }

  onHeroImageLoad(event: Event): void {
    (event.target as HTMLImageElement).parentElement?.classList.add('is-loaded');
  }

  onHeroImageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.parentElement?.classList.add('is-loaded');
    image.hidden = true;
  }

  slides = [
    { img: "http://placehold.it/350x150/000000" },
    { img: "http://placehold.it/350x150/111111" },
    { img: "http://placehold.it/350x150/333333" },
    { img: "http://placehold.it/350x150/666666" }
  ];
  slideConfig = {
    adaptiveHeight: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4500,
    speed: 700,
    dots: true,
    pauseOnHover: true,
    draggable: true,
    swipe: true,
    touchMove: true,
    prevArrow: '#banner-prev',
    nextArrow: '#banner-next',
  };

  breakpoint(e: any) {
    console.log('breakpoint');
  }

  afterChange(e: any) {
    console.log('afterChange');
  }

  beforeChange(e: any) {
    console.log('beforeChange');
  }

  slickInit(e: any) {
    const bannerItem = e?.slick?.$slider?.[0]?.closest?.('.banner-item');
    if (bannerItem && typeof ResizeObserver !== 'undefined') {
      this.bannerResizeObserver?.disconnect();
      this.bannerResizeObserver = new ResizeObserver(() => {
        e?.slick?.setPosition?.();
      });
      this.bannerResizeObserver.observe(bannerItem);
    }
  }

  ngOnDestroy() {
    this.bannerResizeObserver?.disconnect();
  }



  banners = [
    {
      subtitle: 'Save up to 50% off on your first order',
      title: 'Daily Grocery Order and Get <span class="text-main-600">Express</span> Delivery',
      price: '$60.99',
      img: 'assets/images/thumbs/banner-img3.png',
      alt: 'Banner Image 1'
    },
    {
      subtitle: 'Save up to 50% off on your first order',
      title: 'Daily Grocery Order and Get <span class="text-main-600">Express</span> Delivery',
      price: '$60.99',
      img: 'assets/images/thumbs/banner-img1.png',
      alt: 'Banner Image 2'
    }
  ];

  featureItems = DEPARTMENTS.filter(d => d.id !== 'frozen').map(d => ({ id: d.id, title: d.name, img: 'assets/images/thumbs/' + d.image }));
  catalogProduct(id: string) { return CATALOG.find(p => p.id === id)!; }
  departmentCount(id: string) { return CATALOG.filter(p => p.department === id).length; }
  featureSlideConfig = {
    slidesToShow: 8,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 500,
    dots: false,
    pauseOnHover: true,
    arrows: true,
    draggable: true,
    infinite: true,
    nextArrow: '#feature-item-wrapper-next',
    prevArrow: '#feature-item-wrapper-prev',
    responsive: [
      {
        breakpoint: 1699,
        settings: {
          slidesToShow: 8,
        }
      },
      {
        breakpoint: 1599,
        settings: {
          slidesToShow: 8,
        }
      },
      {
        breakpoint: 1399,
        settings: {
          slidesToShow: 6,
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 5,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 424,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 359,
        settings: {
          slidesToShow: 1,
        }
      },
    ]
  };

  promotionalBanners = [
    {
      title: 'Everyday Fresh Meat',
      subtitle: 'Halal Butcher Cuts',
      badge: 'Premium Quality',
      price: '$60.99',
      image: 'assets/images/thumbs/promotional-banner-img1.jpg',
      link: '/shop',
      animationDelay: 400
    },
    {
      title: 'Daily Fresh Vegetables',
      subtitle: 'Organic Farm Greens',
      badge: 'Farm Fresh',
      price: '$60.99',
      image: 'assets/images/thumbs/promotional-banner-img2.jpg',
      link: '/shop',
      animationDelay: 600
    },
    {
      title: 'Everyday Fresh Milk',
      subtitle: 'Chilled Dairy Picks',
      badge: 'Pure Dairy',
      price: '$60.99',
      image: 'assets/images/thumbs/promotional-banner-img3.jpg',
      link: '/shop',
      animationDelay: 800
    },
    {
      title: 'Everyday Fresh Fruits',
      subtitle: 'Seasonal Orchard Harvest',
      badge: 'Daily Picks',
      price: null,
      image: 'assets/images/thumbs/promotional-banner-img4.jpg',
      link: '/shop',
      animationDelay: 1000
    }
  ];

  products = LANDING_ESSENTIALS;

  productSlideConfig = {
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 1500,
    dots: false,
    pauseOnHover: true,
    arrows: true,
    draggable: true,
    infinite: false,
    nextArrow: '#product-one-next',
    prevArrow: '#product-one-prev',
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 5,
          arrows: false,
        }
      },
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 5,
          arrows: false,
        }
      },
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 4,
          arrows: false,
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
          arrows: false,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
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
    ]
  };

  recomandedProducts = LANDING_RECOMMENDED;

  /** Filters Recommended For You products by active category tab. */
  getRecommendedProducts(category: string) {
    if (!category || category === 'all') {
      return this.recomandedProducts;
    }
    return this.recomandedProducts.filter((item) => item.categories?.includes(category));
  }


  ngOnInit(): void {
  }

  // flashsale
  flashSales = [
    {
      badge: 'Bakery Deals',
      badgeClass: 'flash-sales-badge flash-sales-badge--secondary',
      title: 'Fresh Artisan Bakery',
      description: 'Oven-fresh loaves, croissants & daily bakes.',
      backgroundImage: 'assets/images/bg/flash-sale-bakery-grey.jpg',
      cardClass: 'flash-sales-item--bakery-grey',
      bgPositionClass: 'flash-sales-item__bg--left',
      buttonClass: 'btn btn-main-two d-inline-flex align-items-center rounded-pill gap-8 mt-20',
      aosDuration: 600,
      routerLink: ['shop'],
      contentClass: 'ms-sm-auto',
    },
    {
      badge: 'Baby Essentials',
      badgeClass: 'flash-sales-badge flash-sales-badge--grey',
      title: 'Baby Care Collection',
      description: 'Gentle diapers, lotions & daily nursery picks.',
      backgroundImage: 'assets/images/bg/flash-sale-baby-secondary.jpg',
      cardClass: 'flash-sales-item--baby-secondary',
      bgPositionClass: 'flash-sales-item__bg--right',
      buttonClass: 'btn btn-main d-inline-flex align-items-center rounded-pill gap-8 mt-20',
      aosDuration: 1000,
      routerLink: ['shop'],
      contentClass: '',
    }
  ];
  // offers
  offers = [
    {
      bgImage: 'assets/images/bg/offer-bg-img1.png',
      logo: 'assets/images/thumbs/offer-logo.png',
      title: '$5 off your first order',
      delivery: 'Delivery by 6:15am',
      expire: 'Expire Aug 5',
      expireClass: 'text-xs text-heading',
      aosDuration: 600,
      btnClass: 'mt-16 btn bg-success-600 hover-text-white hover-bg-success-700 text-white fw-medium d-inline-flex align-items-center rounded-pill gap-8'
    },
    {
      bgImage: 'assets/images/bg/offer-bg-img2.png',
      logo: 'assets/images/thumbs/offer-logo.png',
      title: '$5 off your first order',
      delivery: 'Delivery by 6:15am',
      expire: 'Expire Aug 5',
      expireClass: 'text-sm text-success-600',
      aosDuration: 800,
      btnClass: 'mt-16 btn bg-white hover-text-white hover-bg-main-800 text-heading fw-medium d-inline-flex align-items-center rounded-pill gap-8'
    }
  ];
  productSlides = [
    {
      imgSrc: "assets/images/thumbs/short-product-img1.png",
      alt: "Product 1",
      rating: 4.8,
      ratingCount: "17k",
      title: "Taylor Farms Broccoli Florets Vegetables",
      price: "$1500.00"
    },
    {
      imgSrc: "assets/images/thumbs/short-product-img2.png",
      alt: "Product 2",
      rating: 4.8,
      ratingCount: "17k",
      title: "Taylor Farms Broccoli Florets Vegetables",
      price: "$1500.00"
    },
    {
      imgSrc: "assets/images/thumbs/short-product-img3.png",
      alt: "Product 3",
      rating: 4.8,
      ratingCount: "17k",
      title: "Taylor Farms Broccoli Florets Vegetables",
      price: "$1500.00"
    },
    {
      imgSrc: "assets/images/thumbs/short-product-img4.png",
      alt: "Product 4",
      rating: 4.8,
      ratingCount: "17k",
      title: "Taylor Farms Broccoli Florets Vegetables",
      price: "$1500.00"
    }
  ];
  topProductSlides = [
    {
      imgSrc: "assets/images/thumbs/short-product-img5.png",
      alt: "Product 1",
      rating: 4.8,
      ratingCount: "17k",
      title: "Taylor Farms Broccoli Florets Vegetables",
      price: "$1500.00"
    },
    {
      imgSrc: "assets/images/thumbs/short-product-img6.png",
      alt: "Product 2",
      rating: 4.8,
      ratingCount: "17k",
      title: "Taylor Farms Broccoli Florets Vegetables",
      price: "$1500.00"
    },
    {
      imgSrc: "assets/images/thumbs/short-product-img7.png",
      alt: "Product 3",
      rating: 4.8,
      ratingCount: "17k",
      title: "Taylor Farms Broccoli Florets Vegetables",
      price: "$1500.00"
    },
    {
      imgSrc: "assets/images/thumbs/short-product-img8.png",
      alt: "Product 4",
      rating: 4.8,
      ratingCount: "17k",
      title: "Taylor Farms Broccoli Florets Vegetables",
      price: "$1500.00"
    }
  ];
  onProductSlides = [
    {
      imgSrc: "assets/images/thumbs/short-product-img5.png",
      alt: "Product 1",
      rating: 4.8,
      ratingCount: "17k",
      title: "Taylor Farms Broccoli Florets Vegetables",
      price: "$1500.00"
    },
    {
      imgSrc: "assets/images/thumbs/short-product-img6.png",
      alt: "Product 2",
      rating: 4.8,
      ratingCount: "17k",
      title: "Taylor Farms Broccoli Florets Vegetables",
      price: "$1500.00"
    },
    {
      imgSrc: "assets/images/thumbs/short-product-img7.png",
      alt: "Product 3",
      rating: 4.8,
      ratingCount: "17k",
      title: "Taylor Farms Broccoli Florets Vegetables",
      price: "$1500.00"
    },
    {
      imgSrc: "assets/images/thumbs/short-product-img8.png",
      alt: "Product 4",
      rating: 4.8,
      ratingCount: "17k",
      title: "Taylor Farms Broccoli Florets Vegetables",
      price: "$1500.00"
    }
  ];

  // hot product
  hotPoducts = [
    { id: 'rec-pk-kinnow-juice', category: 'Drinks & Juices', icon: 'bottle' },
    { id: 'rec-pk-bakery-box', category: 'Bakery & Breads', icon: 'bread' },
    { id: 'rec-pk-sabzi-greens', category: 'Fresh Vegetables', icon: 'carrot' },
    { id: 'rec-pk-snacks-combo', category: 'Snacks & Treats', icon: 'donut' },
    { id: 'rec-pk-dairy-trio', category: 'Dairy & Eggs', icon: 'bottle' },
    { id: 'rec-pk-rashan-basket', category: 'Pantry Essentials', icon: 'cart' },
  ].map((selection, index) => {
    const product = this.recomandedProducts.find(item => item.id === selection.id)!;
    return {
      ...selection,
      name: product.title,
      image: product.image,
      price: product.price,
      oldPrice: product.originalPrice,
      rating: product.rating,
      store: product.store,
      fadeDuration: 200 + index * 100,
    };
  });
  hotDealsSlideConfig = {
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 1500,
    dots: false,
    pauseOnHover: true,
    arrows: true,
    draggable: true,
    infinite: false,
    nextArrow: '#deals-next',
    prevArrow: '#deals-prev',
    responsive: [
      {
        breakpoint: 1399,
        settings: {
          slidesToShow: 3,
          arrows: false,
        }
      },
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 2,
          arrows: false,
        }
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          arrows: false,
        }
      },
    ]
  };

  sortProductSlideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 1500,
    dots: false,
    pauseOnHover: true,
    arrows: true,
    draggable: true,
    infinite: true,
  };

  // brand slider
  frozenProducts = LANDING_FROZEN;

  brandSlides = [{
    "carouselConfig": {
      "class": "brand-slider arrow-style-two",
      "configBinding": "BrandSlideConfig"
    },
    "slides": [
      {
        "class": "brand-item",
        "dataAos": "zoom-in",
        "dataAosDuration": 200,
        "imgSrc": "assets/images/thumbs/brand-pk-shan.svg",
        "imgAlt": "Shan Masalas and Mixes"
      },
      {
        "class": "brand-item",
        "dataAos": "zoom-in",
        "dataAosDuration": 350,
        "imgSrc": "assets/images/thumbs/brand-pk-tapal.svg",
        "imgAlt": "Tapal Danedar Tea"
      },
      {
        "class": "brand-item",
        "dataAos": "zoom-in",
        "dataAosDuration": 500,
        "imgSrc": "assets/images/thumbs/brand-pk-national.svg",
        "imgAlt": "National Foods Spices"
      },
      {
        "class": "brand-item",
        "dataAos": "zoom-in",
        "dataAosDuration": 650,
        "imgSrc": "assets/images/thumbs/brand-pk-kns.svg",
        "imgAlt": "K&N's Halal Frozen"
      },
      {
        "class": "brand-item",
        "dataAos": "zoom-in",
        "dataAosDuration": 800,
        "imgSrc": "assets/images/thumbs/brand-pk-olpers.svg",
        "imgAlt": "Olper's Pure Dairy Milk"
      },
      {
        "class": "brand-item",
        "dataAos": "zoom-in",
        "dataAosDuration": 950,
        "imgSrc": "assets/images/thumbs/brand-pk-dalda.svg",
        "imgAlt": "Dalda Cooking Oil & Ghee"
      },
      {
        "class": "brand-item",
        "dataAos": "zoom-in",
        "dataAosDuration": 1100,
        "imgSrc": "assets/images/thumbs/brand-pk-guard.svg",
        "imgAlt": "Guard Super Basmati Rice"
      },
      {
        "class": "brand-item",
        "dataAos": "zoom-in",
        "dataAosDuration": 1250,
        "imgSrc": "assets/images/thumbs/brand-pk-nurpur.svg",
        "imgAlt": "Nurpur Pure Butter & Milk"
      },
      {
        "class": "brand-item",
        "dataAos": "zoom-in",
        "dataAosDuration": 1400,
        "imgSrc": "assets/images/thumbs/brand-pk-mitchells.svg",
        "imgAlt": "Mitchell's Jams & Farm Foods"
      }
    ]
  }];

  BrandSlideConfig = {
    slidesToShow: 8,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 1500,
    dots: false,
    pauseOnHover: true,
    arrows: true,
    draggable: true,
    infinite: true,
    nextArrow: '#brand-next',
    prevArrow: '#brand-prev',
    responsive: [
      {
        breakpoint: 1599,
        settings: {
          slidesToShow: 7,
          arrows: false,
        }
      },
      {
        breakpoint: 1399,
        settings: {
          slidesToShow: 6,
          arrows: false,
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 5,
          arrows: false,
        }
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 4,
          arrows: false,
        }
      },
      {
        breakpoint: 424,
        settings: {
          slidesToShow: 3,
          arrows: false,
        }
      },
      {
        breakpoint: 359,
        settings: {
          slidesToShow: 2,
          arrows: false,
        }
      },
    ]
  };

  addProductToCart(product: any, fallbackCategory: string = 'Al-Amin Fresh'): void {
    const title = product?.name || product?.title || 'Fresh Hypermart Item';
    const price = product?.discountedPrice ?? product?.price ?? '$14.99';
    this.cartService.addItem({
      id: product?.id,
      name: title,
      category: product?.storeName || product?.store || fallbackCategory,
      price,
      image: product?.image || 'assets/images/thumbs/product-img1.png',
      rating: Number(product?.rating) || 4.8,
      reviewsCount: parseInt(String(product?.reviewsCount ?? product?.reviews ?? 120), 10) || 120,
    });
  }

  addShortDealToCart(): void {
    this.cartService.addItem({
      id: 'featured-meat-combos',
      name: 'Perfectly Packed Meat Combos',
      category: 'Fresh Butchery',
      price: '$60.99',
      image: 'assets/images/thumbs/product-img6.png',
      rating: 4.8,
      reviewsCount: 3,
    });
  }

}

