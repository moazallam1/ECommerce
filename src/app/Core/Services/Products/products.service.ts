import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../Environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private httpClient:HttpClient) { }

  getAllProducts():Observable<any>{
    return this.httpClient.get(`${environment.basUrl}/api/v1/products`)
  }
  
  getSpecificProducts(id:string | null):Observable<any>{
    return this.httpClient.get(`${environment.basUrl}/api/v1/products/${id} `)
  }

}
