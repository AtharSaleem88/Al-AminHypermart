import { Routes } from '@angular/router';
import { LayoutComponent } from './layouts/main-layouts/layout/layout.component';
import { IndexComponent } from './pages/index/index.component';
import { ContactComponent } from './pages/contact/contact.component';
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
                redirectTo: '/checkout',
                pathMatch: 'full'
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
            { path: 'forgot-password', component: AccountComponent, data: { mode: 'forgot', auth: true }, title: 'Forgot Password - Al-Amin Hypermart' },
            { path: 'reset-password', component: AccountComponent, data: { mode: 'reset', auth: true }, title: 'Reset Password - Al-Amin Hypermart' },
            { path: 'create-account', component: AccountComponent, data: { mode: 'register', auth: true }, title: 'Create Account - Al-Amin Hypermart' },
            { path: 'register', redirectTo: 'create-account', pathMatch: 'full' },
            { path: 'account/orders', component: AccountComponent, data: { view: 'orders' }, title: 'Order History - Al-Amin Hypermart' },
            { path: 'account/details', component: AccountComponent, data: { view: 'details' }, title: 'Account Settings - Al-Amin Hypermart' },
            { path: 'account', redirectTo: 'account/details', pathMatch: 'full' },
            {
                path: 'about-us',
                loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
                title: 'About Us - Al-Amin Hypermart'
            },
            { path: 'help-centre', loadComponent: () => import('./pages/help-center/help-center.component').then(m => m.HelpCenterComponent), title: 'Help Centre - Al-Amin Hypermart' },
            { path: 'mobile-app', loadComponent: () => import('./pages/customer-info/customer-info.component').then(m => m.CustomerInfoComponent), data: { infoPage: 'mobile' }, title: 'Mobile App - Al-Amin Hypermart' },
            { path: 'email-signup', loadComponent: () => import('./pages/customer-info/customer-info.component').then(m => m.CustomerInfoComponent), data: { infoPage: 'email' }, title: 'Email Sign Up - Al-Amin Hypermart' },
            { path: 'account-deletion', loadComponent: () => import('./pages/customer-info/customer-info.component').then(m => m.CustomerInfoComponent), data: { infoPage: 'deletion' }, title: 'Account Deletion - Al-Amin Hypermart' },
            { path: 'page/MobileApp', redirectTo: '/mobile-app', pathMatch: 'full' },
            { path: 'page/emailsignup', redirectTo: '/email-signup', pathMatch: 'full' },
            { path: 'page/CustomerAccountDelete', redirectTo: '/account-deletion', pathMatch: 'full' },
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



