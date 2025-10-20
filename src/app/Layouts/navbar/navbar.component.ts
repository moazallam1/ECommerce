import { Component, computed, inject, input, OnInit, AfterViewInit, Signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../Core/Services/Auth/auth.service';
import { CartService } from '../../Core/Services/Cart/cart.service';
import { MyTranslateService } from '../../Core/Services/MyTranslate/my-translate.service';
import { initFlowbite } from 'flowbite'; // ✅ دي أهم سطر

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  host: { 'ngSkipHydration': '' },
})
export class NavbarComponent implements OnInit, AfterViewInit {
  authService = inject(AuthService);
  private readonly myTranslateService = inject(MyTranslateService);
  private readonly cartService = inject(CartService);

  cartNumber: Signal<number> = computed(() => this.cartService.cartNumber());

  isLogin = input<boolean>(true);
  currentLang = 'en';
  isDropdownOpen = false;

  ngOnInit(): void {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this.cartService.cartNumber.set(res.numOfCartItems);
      },
    });
  }

  // ✅ الجزء اللي يفعّل الزرار بتاع Flowbite
  ngAfterViewInit(): void {
    initFlowbite();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  switchLanguage(language: string) {
    this.currentLang = language;
    this.myTranslateService.changeLanguageTranslate(language);
    this.isDropdownOpen = false;
  }
}
