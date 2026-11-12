import { ShippingComponent } from '../../../component/shipping/shipping.component';
import { Component, computed, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { BottomNavComponent } from '../../../component/bottom-nav/bottom-nav.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { AccountService } from '../../../services/account.service';
@Component({ selector: 'app-layout', standalone: true, imports: [RouterOutlet, HeaderComponent, FooterComponent, BottomNavComponent, ShippingComponent], templateUrl: './layout.component.html', styleUrl: './layout.component.scss' })
export class LayoutComponent {
  private readonly router = inject(Router);
  private readonly account = inject(AccountService);
  private readonly url = toSignal(this.router.events.pipe(filter(event => event instanceof NavigationEnd), map(event => event.urlAfterRedirects.split('?')[0])), { initialValue: this.router.url.split('?')[0] });
  readonly authScreen = computed(() => ['/login', '/create-account', '/register'].includes(this.url()) || (this.url().startsWith('/account') && !this.account.user()));
}
