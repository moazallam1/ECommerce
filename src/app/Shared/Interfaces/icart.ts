export interface ICart {
  _id: string;
  cartOwner: string;
  products: CartItem[];
  totalCartPrice: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CartItem {
  _id: string;
  product: Product;
  count: number;
  price: number;
}

export interface Product {
  _id: string;
  title: string;
  quantity: number;
  imageCover: string;
  category: Category;
  brand: Category;
  ratingsAverage: number;
  subcategory: Subcategory[];
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  category: string; // هنا ممكن يكون اسم الـ category أو الـ category _id
}
