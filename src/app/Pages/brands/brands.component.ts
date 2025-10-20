import { Component, inject, OnInit, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { BrandsService } from '../../Core/Services/Brands/brands.service';
import { IBrand } from '../../ibrand';

@Component({
  selector: 'app-brands',
  imports: [DialogModule, ButtonModule,TranslateModule],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent  implements OnInit {

  private readonly brandsService=inject(BrandsService);

  visible = signal(false)
  allBrands =signal <IBrand[]>([])
  selectedBrand =signal<IBrand |null>(null)
  


  getAllBrands(){
    this.brandsService.getAllBrands().subscribe({
      next:(res)=>{
        console.log(res.data);
        this.allBrands.set(res.data);
      }
    })

  }

  

  ngOnInit(): void {
     this.getAllBrands();
  }


  openDialog(brand: IBrand) {
      // this.selectedBrand = brand;
      // this.visible = true;

      this.selectedBrand.set(brand);
      this.visible.set(true);
    }
}
