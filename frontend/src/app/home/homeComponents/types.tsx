export interface User {
  id: number;
  email: string;
  fullName: string;
  isNewUser: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  seller: User;
}
