import { Routes } from '@angular/router';
import { LayoutComponent } from './layouts/main-layouts/layout/layout.component';
import { IndexComponent } from './pages/index/index.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CartComponent } from './pages/cart/cart.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { AccountComponent } from './pages/account/account.component';
import { ShopComponent } from './pages/shop/shop.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { ProductDetailsTwoComponent } from './pages/product-details-two/product-details-two.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                component: IndexComponent,
                title: 'Al-Amin Hypermart - Home',
            },
            {
                path: 'shop/product/:id',
                loadComponent: () => import('./pages/catalog-product/catalog-product.component').then(m => m.CatalogProductComponent),
                title: 'Product - Al-Amin Hypermart'
            },
            {
                path: 'shop',
                component: ShopComponent,
                title: 'Shop - Al-Amin Hypermart'
            },
            {
                path: 'product-details',
                component: ProductDetailsComponent,
                title: 'Product Details - Al-Amin Hypermart'
            },
            {
                path: 'product-details-two',
                component: ProductDetailsTwoComponent,
                title: 'Product Details - Al-Amin Hypermart'
            },
            {
                path: 'cart',
                component: CartComponent,
                title: 'Cart - Al-Amin Hypermart'
            },
            {
                path: 'wishlist',
                component: WishlistComponent,
                title: 'Wishlist - Al-Amin Hypermart'
            },
            {
                path: 'checkout',
                component: CheckoutComponent,
                title: 'Checkout - Al-Amin Hypermart'
            },
            { path: 'login', component: AccountComponent, data: { auth: true }, title: 'Sign In - Al-Amin Hypermart' },
            { path: 'create-account', component: AccountComponent, data: { mode: 'register', auth: true }, title: 'Create Account - Al-Amin Hypermart' },
            { path: 'register', redirectTo: 'create-account', pathMatch: 'full' },
            { path: 'account/orders', component: AccountComponent, data: { view: 'orders' }, title: 'Order History - Al-Amin Hypermart' },
            { path: 'account/details', component: AccountComponent, data: { view: 'details' }, title: 'Account Details - Al-Amin Hypermart' },
            {
                path: 'account',
                component: AccountComponent,
                title: 'Account - Al-Amin Hypermart'
            },
            {
                path: 'about-us',
                loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
                title: 'About Us - Al-Amin Hypermart'
            },
            { path: 'help-centre', loadComponent: () => import('./pages/help-center/help-center.component').then(m => m.HelpCenterComponent), title: 'Help Centre - Al-Amin Hypermart' },
            { path: 'help-center', redirectTo: 'help-centre', pathMatch: 'full' },
            { path: 'help', redirectTo: 'help-centre', pathMatch: 'full' },
            { path: 'page/HelpCenter', redirectTo: 'help-centre', pathMatch: 'full' },
            { path: 'about', redirectTo: 'about-us', pathMatch: 'full' },
            { path: 'page/AboutUs', redirectTo: 'about-us', pathMatch: 'full' },
            {
                path: 'contact',
                component: ContactComponent,
                title: 'Contact Us - Al-Amin Hypermart'
            },
            {
                path: '**',
                redirectTo: ''
            }
        ]
    }
];



