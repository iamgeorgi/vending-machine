export type Product = {
    id: string;
    name: string;
    category: ProductCategory;
    price: number;
    quantity: number;
}

export type ProductFormValue = {
  name: string;
  category: ProductCategory;
  price: number;
  quantity: number;
}

export enum ProductCategory {
  Beverage = 'beverage',
  Snack = 'snack',
  Candy = 'candy',
  Other = 'other',
}