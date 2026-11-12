import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Import this
import { BreadcrumbComponent } from '../../component/breadcrumb/breadcrumb.component';


@Component({
  selector: 'app-contact',
  imports: [CommonModule,BreadcrumbComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

}
