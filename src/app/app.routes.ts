import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './Layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './Layouts/blank-layout/blank-layout.component';
import { LoginComponent } from './Pages/login/login.component';
import { RegisterComponent } from './Pages/register/register.component';
import { NotfoundComponent } from './Pages/notfound/notfound.component';
import { authGuard } from './Core/Guards/auth.guard';
import { loggedGuard } from './Core/Guards/logged.guard';
import { ForgetPasswordComponent } from './Pages/forget-password/forget-password.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: '', component: AuthLayoutComponent, canActivate: [loggedGuard],
    children: [
      { path: 'login', component: LoginComponent, title: 'Login' },
      { path: 'register', component: RegisterComponent, title: 'Register' },
      { path: 'forget', component: ForgetPasswordComponent, title: 'Reset Password 🔐' },
    ]
  },

  { path: '', component: BlankLayoutComponent, canActivate: [authGuard] ,
    children: [
      { path: 'home', loadComponent: () => import('./Pages/home/home.component').then(m => m.HomeComponent), title: 'Home' },
      { path: 'products', loadComponent: () => import('./Pages/products/products.component').then(m => m.ProductsComponent), title: 'Products' },
      { path: 'brands', loadComponent: () => import('./Pages/brands/brands.component').then(m => m.BrandsComponent), title: 'Brands' },
      { path: 'categories', loadComponent: () => import('./Pages/categories/categories.component').then(m => m.CategoriesComponent), title: 'Categories' },
      { path: 'cart', loadComponent: () => import('./Pages/cart/cart.component').then(m => m.CartComponent), title: 'Cart' },
      { path: 'checkout/:id', loadComponent: () => import('./Pages/check-out/check-out.component').then(m => m.CheckOutComponent), title: 'Checkout' },
      { path: 'details/:id', loadComponent: () => import('./Pages/details/details.component').then(m => m.DetailsComponent), title: 'Details' },
      { path: '**', component: NotfoundComponent, title: 'Not Found' },
    ]
  },
];

