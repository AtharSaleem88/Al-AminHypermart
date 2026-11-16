import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandPageMotion } from '../../shared/brand-page-motion';

@Component({
  selector: 'app-help-center', standalone: true, imports: [RouterLink],
  templateUrl: './help-center.component.html',
  styleUrls: ['../about/about.component.scss', './help-center.component.scss'],
})
export class HelpCenterComponent extends BrandPageMotion {
  readonly categories = [
    { id: 'delivery', image: 'assets/images/thumbs/hero-slide2.jpg', title: 'Delivery & Pickup', icon: 'ph-truck', questions: [
      { question: 'Where do you deliver?', answer: 'We deliver across major areas of the city. Zone availability is calculated at checkout.' },
      { question: 'How long will delivery take?', answer: 'Most orders arrive within 3–4 hours.' },
      { question: 'Can I collect from store?', answer: 'Yes, choose “Store Pickup” at checkout.' },
    ] },
    { id: 'payments', image: 'assets/images/thumbs/hero-slide1.jpg', title: 'Payments & Billing', icon: 'ph-credit-card', questions: [
      { question: 'What payment methods are accepted?', answer: 'Cash on delivery and cards on delivery.' },
      { question: 'Will I get an invoice?', answer: 'Yes, you will receive an invoice verified through our IPOS.' },
    ] },
    { id: 'accounts', image: 'assets/images/bg/about-storefront.jpg', title: 'Accounts & Profile', icon: 'ph-user-circle', questions: [
      { question: 'Do I need an account?', answer: 'No, you can shop as a guest. Accounts help save locations and track orders.' },
      { question: 'I forgot my password?', answer: 'Click “Forgot Password” on login for steps to reset.' },
    ] },
    { id: 'products', image: 'assets/images/thumbs/cat-vegetables.jpg', title: 'Products & Stock', icon: 'ph-basket', questions: [
      { question: 'Are online items in-store?', answer: 'Mostly yes, though bakery and seasonal stocks vary daily.' },
      { question: 'What if an item is out of stock?', answer: 'Most items are already stocked. If an item is unavailable, please reach our support team.' },
      { question: 'Do you sell fresh bakery online?', answer: 'Yes, daily cakes, bread, and pastries can be ordered fresh.' },
    ] },
  ];
}
