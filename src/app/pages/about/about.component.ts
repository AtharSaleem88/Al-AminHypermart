import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandPageMotion } from '../../shared/brand-page-motion';

@Component({
  selector: 'app-about', standalone: true, imports: [RouterLink],
  templateUrl: './about.component.html', styleUrl: './about.component.scss',
})
export class AboutComponent extends BrandPageMotion {
  readonly advantages = [
    { title: 'Freshness, every day.', image: 'assets/images/thumbs/cat-vegetables.jpg', department: 'vegetables', text: 'Farm-fresh produce and everyday essentials, selected for your family.', icon: 'ph-leaf' },
    { title: 'More under one roof.', image: 'assets/images/thumbs/hero-slide3.jpg', department: 'pantry', text: 'Eight departments. One place to stock the life you love.', icon: 'ph-squares-four' },
    { title: 'Value you can trust.', image: 'assets/images/thumbs/pk-dairy-milk.jpg', department: 'dairy', text: 'Transparent pricing and the same care in every department.', icon: 'ph-seal-check' },
    { title: 'Made for your everyday.', image: 'assets/images/thumbs/hero-slide2.jpg', department: 'fruits', text: 'A team of over 300 people, putting our community first.', icon: 'ph-users-three' },
  ];
  readonly metrics = [
    { value: 80000, display: '80,000', suffix: '', label: 'Sq ft largest in Gujranwala', icon: 'ph-buildings' },
    { value: 300, display: '300+', suffix: '+', label: 'Employees across departments', icon: 'ph-users-three' },
    { value: 8, display: '8', suffix: '', label: 'Departments under one roof', icon: 'ph-squares-four' },
    { value: 2023, display: '2023', suffix: '', label: 'Year of establishment', icon: 'ph-sun-horizon' },
  ];
}

