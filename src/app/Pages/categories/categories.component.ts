import { Component, inject, OnInit, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CategoriesService } from '../../Core/Services/Categories/categories.service';
import { ICategory } from '../../Shared/Interfaces/icategory';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [DialogModule, ButtonModule, TranslateModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
 
  categories = signal<ICategory[]>([]);
  searchWord = signal('');
  visible = signal(false);
  selectedCategory = signal<ICategory | null>(null);

  getAllCategoriesData() {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categories.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  ngOnInit(): void {
    this.getAllCategoriesData();
  }

  // 🟢 فتح المودال
  openDialog(cat: ICategory) {
    // this.selectedCategory = cat;
    // this.visible = true;

    this.selectedCategory.set(cat);
    this.visible.set(true)

  }
}
