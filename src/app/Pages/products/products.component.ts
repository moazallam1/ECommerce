import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../Core/Services/Cart/cart.service';
import { ProductsService } from '../../Core/Services/Products/products.service';
import { IProduct } from '../../Shared/Interfaces/iproduct';
import { SearchPipe } from '../../Shared/Pipes/search.pipe';
import { TermtextPipe } from '../../Shared/Pipes/termtext.pipe';

@Component({
  selector: 'app-products',
  imports: [
    RouterLink,
    RouterLinkActive,
    TitleCasePipe,
    TermtextPipe,
    FormsModule,
    SearchPipe,
    TranslateModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly toastService = inject(ToastrService);

  products = signal<IProduct[]>([])
  searchWord = signal('')



  getProductsData() {
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.products.set(res.data);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  ngOnInit(): void {
    this.getProductsData();
  }

  addProductToCart(id: string) {

    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status === 'success') {
          this.toastService.success(res.message);
          this.cartService.cartNumber.set(res.numOfCartItems)

        }else{
          this.toastService.error(res.message);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
