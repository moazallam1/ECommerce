import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { OrdersService } from '../../Core/Services/Orders/orders.service';

@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,TranslateModule],
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.scss',
})
export class CheckOutComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private ordersService = inject(OrdersService);
  isLoading: boolean = false;
  cartId: string = '';
  checkOut!: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.getCartId();
    this.initForm();
  }
  initForm() {
    this.checkOut = this.formBuilder.group({
      details: ['', [Validators.required, Validators.minLength(10)]],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
      ],
      city: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  getCartId() {
    return this.activatedRoute.paramMap.subscribe({
      next: (p) => {
        this.cartId = p.get('id')!;
      },
      error: (err) => {
        console.error('Error fetching cart ID:', err);
      },
    });
  }
confirmOrder() {
  if (this.checkOut.valid) {
    this.isLoading = true;

    this.ordersService.confirmOrder(this.cartId, this.checkOut.value).subscribe({
      next: (res) => {
        console.log('✅ Order confirmed:', res);

        if (res.session?.url) {
          window.location.href = res.session.url;
        } else {
          // لو مفيش لينك (مش متوقع في الحالة دي)
          console.error('❌ No payment URL returned from API');
          alert('Something went wrong. Please try again.');
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error confirming order:', err);
        alert('Failed to confirm order. Please try again later.');
        this.isLoading = false;
      }
    });
  } else {
    this.checkOut.markAllAsTouched();
  }
}



}
