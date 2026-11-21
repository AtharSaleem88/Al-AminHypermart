import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BrandPageMotion } from '../../shared/brand-page-motion';

type InfoPage = {
  title: string; eyebrow: string; lead: string; accent: string; intro: string[];
  section: string; cards: { title: string; text: string; icon: string }[];
  noteTitle: string; noteLabel: string; notes: string[]; closing: string;
};
const PAGES: Record<string, InfoPage> = {
  mobile: {
    title: 'Mobile App', eyebrow: '', lead: 'All in one app.', accent: 'Life. Stocked.',
    intro: ['Browse every department, order ahead, and check out from your phone. The Al-Amin Hypermart app brings groceries, electronics, home and living, toys, bakery, and restaurant shopping together.', 'Order fresh bakery before your visit, apply vouchers at checkout, and complete your purchase through a fast, secure experience. The app is free for iOS and Android.'],
    section: 'How to download.', cards: [
      { title: 'iPhone', icon: 'ph-apple-logo', text: 'Search “Al-Amin Hypermart” on the App Store or use the download link below. Browse products, place orders, and track deliveries with the speed and reliability of iOS. Sign in with your account to start shopping.' },
      { title: 'Android', icon: 'ph-google-play-logo', text: 'Search “Al-Amin Hypermart” on Google Play or use the download link below. Shop thousands of products, discover exclusive offers, and manage your orders. Create an account or sign in to get started.' }
    ],
    noteTitle: 'A little help, whenever you need it.', noteLabel: 'ORDER & APPLICATION SUPPORT',
    notes: ['For an order issue, contact our team on WhatsApp or call +92 321 0011142.', 'If the app is not working, check for the latest update or reinstall it. If the problem continues, our support team is ready to help.'], closing: 'Your everyday shop. In your pocket.'
  },
  email: {
    title: 'Email Sign Up', eyebrow: 'STAY CONNECTED', lead: 'Join our email family.', accent: 'More reasons to smile.',
    intro: ['Never miss exclusive deals, offers, and community updates. Join our email list to hear about new arrivals, special promotions, and seasonal discounts first.', 'Thousands of customers trust Al-Amin Hypermart for quality products and premium service. Stay connected and make the most of our offers all year round.'],
    section: 'What you receive.', cards: [
      { title: 'Promotions & early access', icon: 'ph-tag', text: 'Get early alerts about member-only discounts and limited-time sales, plus first access to festive collections and special product launches.' },
      { title: 'Weekly updates & tips', icon: 'ph-envelope-simple', text: 'Discover recipes, practical shopping tips, and curated recommendations from your favourite hypermart departments.' }
    ],
    noteTitle: 'Your privacy matters.', noteLabel: 'SAFE · SECURE · CONFIDENTIAL',
    notes: ['We respect your privacy. Your information is kept safe, secure, and confidential and is never shared with third parties.', 'Our goal is to improve your shopping experience, not fill your inbox with spam. You can unsubscribe at any time with a single click.'], closing: 'A little more Al-Amin. In your inbox.'
  },
  deletion: {
    title: 'Account Deletion', eyebrow: 'ACCOUNT SECURITY', lead: 'Your account.', accent: 'Your control.',
    intro: ['Al-Amin Hypermart lets you request permanent removal of your account and personal information from its system.', 'Email info@al-aminhypermart.com with the subject “Account Removal Request” and include your registered mobile number. Our team uses this to verify your identity securely before starting the process.'],
    section: 'Information deletion & retention.', cards: [
      { title: 'Permanently removed', icon: 'ph-user-minus', text: 'Once deletion is completed, your user profile details, contact information, saved delivery locations, application activity records, and local purchase history are removed.' },
      { title: 'Regulatory retention', icon: 'ph-shield-check', text: 'Certain financial or transaction records may be archived for up to 90 days where required by applicable laws, regulatory guidelines, or accounting compliance standards.' }
    ],
    noteTitle: 'How your request is processed.', noteLabel: 'VERIFICATION & SUPPORT',
    notes: ['First, our team completes verification of your registered mobile number. The processing window is 7 working days after verification.', 'Any legally required archive is retained for a maximum of 90 days. For help with verification or permanent deletion, contact info@al-aminhypermart.com.'], closing: 'Here to help. Every step of the way.'
  }
};
@Component({
  selector: 'app-customer-info', standalone: true, imports: [RouterLink],
  templateUrl: './customer-info.component.html',
  styleUrls: ['../about/about.component.scss', './customer-info.component.scss']
})
export class CustomerInfoComponent extends BrandPageMotion {
  readonly kind = inject(ActivatedRoute).snapshot.data['infoPage'] as string;
  readonly page = PAGES[this.kind];
  readonly appStore = 'https://apps.apple.com/ph/app/al-amin-hyper-mart/id6762094958';
  readonly googlePlay = 'https://play.google.com/store/apps/details?id=com.alaminhypermart';
  readonly contactHref = this.kind === 'deletion'
    ? 'mailto:info@al-aminhypermart.com?subject=Account%20Removal%20Request&body=Registered%20mobile%20number%3A%20'
    : 'mailto:info@al-aminhypermart.com?subject=Email%20List%20Signup';
}
