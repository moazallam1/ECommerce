import { LowerCasePipe, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ProductsService } from '../../Core/Services/Products/products.service';
import { IProduct } from '../../Shared/Interfaces/iproduct';
import { CartService } from '../../Core/Services/Cart/cart.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-details',
  imports: [CarouselModule,TitleCasePipe,LowerCasePipe,TranslateModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit{

  private readonly activatedRoute=inject(ActivatedRoute); // to get data(id) from url
  private readonly productsService=inject(ProductsService)
  private readonly cartService=inject(CartService)
  private readonly toastrService=inject(ToastrService)
  productDetails:IProduct|null =null;

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next:(p)=>{
          let productId = p.get('id');

          this.productsService.getSpecificProducts(productId).subscribe({
            next:(res)=>{
                console.log(res.data);
                this.productDetails =res.data;
                
            },
            error:(err)=>{
              console.log(err);
              
            }
          })
      }
    })
  }

  customDetailsSlider: OwlOptions = {
      loop: true,
      mouseDrag: false,
      touchDrag: false,
      pullDrag: false,
      dots: false,
      navSpeed: 800,
      autoplay:true,
      autoplayTimeout:4000,
      autoplayHoverPause:true,
      items:1,
      navText: [
      '<i class="fa-solid fa-chevron-left"></i>',
      '<i class="fa-solid fa-chevron-right"></i>'
    ],
      
      nav: false
    }
  
addToCart(id: string) {

    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status === 'success') {
          this.toastrService.success(res.message);
          this.cartService.cartNumber.set(res.numOfCartItems)
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
