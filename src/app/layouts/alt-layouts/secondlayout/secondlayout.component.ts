import { Component } from '@angular/core';
import { SecondfooterComponent } from '../secondfooter/secondfooter.component';
import { SecondheaderComponent } from '../secondheader/secondheader.component';
import { BottomNavComponent } from '../../../component/bottom-nav/bottom-nav.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-secondlayout',
  standalone: true,
  imports: [SecondfooterComponent, SecondheaderComponent, BottomNavComponent, RouterOutlet],
  templateUrl: './secondlayout.component.html',
  styleUrl: './secondlayout.component.scss'
})
export class SecondlayoutComponent {

}
