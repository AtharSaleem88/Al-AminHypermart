import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandPageMotion } from '../../shared/brand-page-motion';

@Component({
  selector: 'app-about', standalone: true, imports: [RouterLink],
  templateUrl: './about.component.html', styleUrl: './about.component.scss',
})
export class AboutComponent extends BrandPageMotion {
  readonly heroCharacters = Array.from('About Al-Amin.');
  readonly metrics = [
    { value: 80000, display: '80,000', suffix: '', label: 'Sq ft largest in Gujranwala', icon: 'ph-buildings' },
    { value: 300, display: '300+', suffix: '+', label: 'Employees across departments', icon: 'ph-users-three' },
    { value: 8, display: '8', suffix: '', label: 'Departments under one roof', icon: 'ph-squares-four' },
    { value: 2023, display: '2023', suffix: '', label: 'Year of establishment', icon: 'ph-sun-horizon' },
  ];
}

