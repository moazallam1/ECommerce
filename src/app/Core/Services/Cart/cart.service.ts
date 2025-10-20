import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../Environment/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private httpClient: HttpClient) {}
  userToken: any = localStorage.getItem('userToken');
  cartNumber: WritableSignal<number> = signal(0)     


  addProductToCart(id: string): Observable<any> {
    return this.httpClient.post(
      `${environment.basUrl}/api/v1/cart`,
      {
        productId: id,
      },
      {
        headers: {
          token: this.userToken,
        },
      }
    );
  }

  getLoggedUserCart(): Observable<any> {
    return this.httpClient.get(`${environment.basUrl}/api/v1/cart`, {
      headers: {
        token: this.userToken,
      },
    });
  }

  removeSpecificCartItem(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.basUrl}/api/v1/cart/${id}`, {
      headers: {
        token: this.userToken,
      },
    });
  }
  updateCartProductQuantity(id: string, quantity: number): Observable<any> {
    return this.httpClient.put(
      `${environment.basUrl}/api/v1/cart/${id}`,
      {
        'count': quantity,
      },
      {
        headers: {
          token: this.userToken,
        },
      }
    );
  }

  clearUserCart(){
    return this.httpClient.delete(`${environment.basUrl}/api/v1/cart`, {
      headers: {
        token: this.userToken,
      },
    });
  }
}
