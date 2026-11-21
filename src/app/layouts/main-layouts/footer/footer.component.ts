import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

type FooterLink = { label: string; route?: string[]; fragment?: string; href?: string; queryParams?: Record<string, string> };

@Component({
  selector: 'app-footer',
  imports: [RouterLink, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  footerSections: { title: string; links: FooterLink[] }[] = [
    {
      title: 'CUSTOMER CARE',
      links: [
        { label: 'About Us', route: ['/about-us'] },
        { label: 'Help Centre', route: ['/help-centre'] },
        { label: 'Email Sign Up', route: ['/email-signup'] },
        { label: 'Mobile App', route: ['/mobile-app'] }
      ]
    },
    {
      title: 'MY ACCOUNT',
      links: [
        { label: 'My Account', route: ['/account/details'] },
        { label: 'Wishlist', route: ['/wishlist'] },
        { label: 'Order History', route: ['/account/orders'] },
        { label: 'Account Deletion Request', route: ['/account-deletion'] }
      ]
    },
    {
      title: 'DEPARTMENTS',
      links: [
        { label: 'Dairy & Eggs', route: ['/shop'], queryParams: { category: 'dairy' } },
        { label: 'Fresh Produce', route: ['/shop'], queryParams: { category: 'vegetables' } },
        { label: 'Frozen Food', route: ['/shop'], queryParams: { category: 'frozen' } },
        { label: 'Pantry Staples', route: ['/shop'], queryParams: { category: 'pantry' } }
      ]
    }
  ];
}
