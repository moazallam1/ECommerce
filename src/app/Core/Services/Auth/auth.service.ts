import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../Environment/environment';
import { jwtDecode } from "jwt-decode";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private httpClient:HttpClient) { }
  private router=inject(Router)
  userData:any;



  sendRegisterForm(data:object):Observable<any>{

   return this.httpClient.post(`${environment.basUrl}/api/v1/auth/signup`,data)
   
  }
  sendLoginForm(data:object):Observable<any>{

   return this.httpClient.post(`${environment.basUrl}/api/v1/auth/signin`,data)
  }


  saveUserData():void{
    if (localStorage.getItem('userToken')!=null) {
   this.userData=  jwtDecode(localStorage.getItem('userToken')!)
      
    }
  }


  logOut():void{

    localStorage.removeItem('userToken');
    this.userData=null

    this.router.navigate(['/login'])

  }

  verifyEmail(data:any):Observable<any>{

    return this.httpClient.post(`${environment.basUrl}/api/v1/auth/forgotPasswords`,data )
  }
  verifyResetCode(data:any):Observable<any>{

    return this.httpClient.post(`${environment.basUrl}/api/v1/auth/verifyResetCode`,data )
  }
  verifyResetPassword(data:any):Observable<any>{

    return this.httpClient.put(`${environment.basUrl}/api/v1/auth/resetPassword`,data )
  }
}
