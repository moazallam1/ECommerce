import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../Environment/environment';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {

  constructor(private  httpClient: HttpClient) { }


  getAllBrands():Observable<any>{

    return this.httpClient.get(`${environment.basUrl}/api/v1/brands`)
  }
   getSpecificBrand(id:string | null):Observable<any>{
    return this.httpClient.get(`${environment.basUrl}/api/v1/brands/${id} `)
  }





}
