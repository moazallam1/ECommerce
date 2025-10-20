import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../Core/Services/Cart/cart.service';
import { CategoriesService } from '../../Core/Services/Categories/categories.service';
import { ProductsService } from '../../Core/Services/Products/products.service';
import { ICategory } from '../../Shared/Interfaces/icategory';
import { IProduct } from '../../Shared/Interfaces/iproduct';
import { signal } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [CarouselModule, RouterLink, TranslateModule],
})
export class HomeComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);

  products = signal<IProduct[]>([]);
  categories = signal<ICategory[]>([]);

  customOptions: OwlOptions = {
    loop: true,
    rtl: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 400,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    navText: [
      '<i class="fa-solid fa-chevron-left"></i>',
      '<i class="fa-solid fa-chevron-right"></i>',
    ],
    responsive: {
      0: { items: 1 },
      400: { items: 2 },
      740: { items: 3 },
      940: { items: 6 },
    },
    nav: false,
  };

  customMainSlider: OwlOptions = {
    loop: true,
    rtl: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 400,
    autoplay: true,
    autoplayTimeout: 6000,
    autoplayHoverPause: true,
    items: 1,
    navText: [
      '<i class="fa-solid fa-chevron-left"></i>',
      '<i class="fa-solid fa-chevron-right"></i>',
    ],
    nav: false,
  };

  ngOnInit(): void {
    this.getProductsData();
    this.getCategoriesData();
  }

  getProductsData() {
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.products.set(res.data);
      },
      error: (err) => console.log(err),
    });
  }

  getCategoriesData() {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categories.set(res.data);
      },
      error: (err) => console.log(err),
    });
  }

  addProductToCart(id: string) {
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status === 'success') {
          this.toastrService.success(res.message);
          this.cartService.cartNumber.set(res.numOfCartItems);
        } else {
          this.toastrService.error(res.message);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
