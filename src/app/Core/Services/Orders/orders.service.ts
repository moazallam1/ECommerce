import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../Environment/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  constructor(private httpClient: HttpClient) { }
    userToken: any = localStorage.getItem('userToken');

  confirmOrder(cartId: string, orderData: any):Observable<any> {
    return this.httpClient.post(`${environment.basUrl}/api/v1/orders/checkout-session/${cartId}?url=http://localhost:4200`, {
      "shippingAddress": orderData  
    },{
      headers:{token:this.userToken}
    }
  );
  }



}
