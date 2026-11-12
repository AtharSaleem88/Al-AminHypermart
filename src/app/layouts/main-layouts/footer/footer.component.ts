import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  footerSections = [
    {
      title: 'Information',
      links: [
        { label: 'About Us', route: ['/about-us'] },
        { label: 'All Departments', route: ['shop'] },
        { label: 'Customer Care', route: ['/help-centre'] },
        { label: 'Fresh Guarantee', route: ['shop'] }
      ]
    },
    {
      title: 'Customer Support',
      links: [
        { label: 'Help Centre', route: ['/help-centre'] },
        { label: 'Special Offers', route: ['shop'] },
        { label: 'Coupons & Savings', route: ['shop'] },
        { label: 'Order History', route: ['/account/orders'] }
      ]
    },
    {
      title: 'My Account',
      links: [
        { label: 'My Account', route: ['account'] },
        { label: 'Shopping Cart', route: ['cart'] },
        { label: 'Wishlist', route: ['wishlist'] },
        { label: 'Checkout', route: ['checkout'] }
      ]
    },
    {
      title: 'Fresh Hypermart',
      links: [
        { label: 'Dairy & Eggs', route: ['shop'] },
        { label: 'Meat & Seafood', route: ['shop'] },
        { label: 'Fresh Produce', route: ['shop'] },
        { label: 'Bread & Bakery', route: ['shop'] },
        { label: 'Pantry Staples', route: ['shop'] }
      ]
    }
  ];
}


