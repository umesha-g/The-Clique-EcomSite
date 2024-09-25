export interface User {
  id: string;
  email: string;
  fullName: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  seller: User;
  imageUrl: string;
}
