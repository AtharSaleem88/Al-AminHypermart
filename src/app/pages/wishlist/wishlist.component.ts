import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../component/product-card/product-card.component';
import { WishlistService } from '../../services/wishlist.service';
@Component({selector:'app-wishlist',imports:[RouterLink,ProductCardComponent],templateUrl:'./wishlist.component.html',styleUrl:'./wishlist.component.scss'})
export class WishlistComponent {readonly wishlist=inject(WishlistService);}
