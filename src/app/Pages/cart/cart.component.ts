import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CartService } from '../../Core/Services/Cart/cart.service';
import { ICart } from '../../Shared/Interfaces/icart';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, TranslateModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastrService);

  cartDetails = signal<ICart>({
    _id: '',
    cartOwner: '',
    products: [],
    totalCartPrice: 0,
    createdAt: '',
    updatedAt: '',
    __v: 0,
  });

  addingStates = signal<{ [productId: string]: boolean }>({});
  removingStates = signal<{ [productId: string]: boolean }>({});
  subtractingStates = signal<{ [productId: string]: boolean }>({});

  isClearing = signal(false);
  isCheckingOut = signal(false);

  ngOnInit(): void {
    this.getLoggedUserCart();
  }

  getLoggedUserCart() {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        if (res?.data?.products) {
          this.cartDetails.set(res.data);
        } else {
          this.cartDetails().products = [];
        }
      },
      error: (err) => {
        console.log(err);
        this.cartDetails().products = [];
      },
    });
  }

  removeItem(id: string) {
    this.removingStates()[id] = true;
    this.cartService.removeSpecificCartItem(id).subscribe({
      next: (res) => {
        this.cartDetails.set(res.data);
        this.removingStates()[id] = false;
        this.cartService.cartNumber.set(res.numOfCartItems);

        if (res.status === 'success') {
          this.toastService.success('Item removed successfully');
        } else {
          this.toastService.error('Failed to remove item');
        }
      },
      error: () => {
        this.removingStates()[id] = false;
      },
    });
  }

  updateQuantity(id: string, quantity: number, type: 'add' | 'minus') {
    if (quantity < 1) return;

    if (type === 'add') this.addingStates()[id] = true;
    else this.subtractingStates()[id] = true;

    this.cartService.updateCartProductQuantity(id, quantity).subscribe({
      next: (res) => {
        this.cartDetails.set(res.data);
        this.addingStates()[id] = false;
        this.subtractingStates()[id] = false;

        if (res.status === 'success') {
          this.toastService.success('Quantity updated successfully');
        } else {
          this.toastService.error('Failed to update quantity');
        }
      },
      error: () => {
        this.addingStates()[id] = false;
        this.subtractingStates()[id] = false;
      },
    });
  }

  clearCart() {
    Swal.fire({
      title: 'Clear your cart?',
      text: 'This will remove all products from your cart.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, clear it',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'modern-alert',
        confirmButton: 'modern-confirm',
        cancelButton: 'modern-cancel',
        title: 'modern-title',
        htmlContainer: 'modern-text',
      },
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.isClearing.set(true);
        this.cartService.clearUserCart().subscribe({
          next: () => {
            this.cartDetails.set({
              _id: '',
              cartOwner: '',
              products: [],
              totalCartPrice: 0,
              createdAt: '',
              updatedAt: '',
              __v: 0,
            });
            this.isClearing.set(false);
            this.cartService.cartNumber.set(0);

            Swal.fire({
              title: 'Cart Cleared!',
              text: 'All items have been removed successfully.',
              icon: 'success',
              customClass: {
                popup: 'modern-alert',
                confirmButton: 'modern-confirm',
                title: 'modern-title',
                htmlContainer: 'modern-text',
              },
            });
          },
          error: () => {
            this.isClearing.set(false);
            Swal.fire({
              title: 'Error',
              text: 'Something went wrong while clearing your cart.',
              icon: 'error',
              customClass: {
                popup: 'modern-alert',
                confirmButton: 'modern-confirm',
                title: 'modern-title',
                htmlContainer: 'modern-text',
              },
            });
          },
        });
      }
    });
  }

  goToCheckout(cartId: string) {
    if (!this.cartDetails()?.products?.length) return;

    this.isCheckingOut.set(true);
    setTimeout(() => {
      this.router.navigate(['/checkout', cartId]);
      this.isCheckingOut.set(false);
    }, 1000);
  }
}
