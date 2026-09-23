import { Product, ProductCategory } from '../models/product.model';

export function getProductImage(product: Product): string {
  if (product.imageUrl != null) {
    return product.imageUrl;
  }

  switch (product.category) {
    case ProductCategory.Beverage:
      return 'assets/categories/beverage.png';
    case ProductCategory.Snack:
      return 'assets/categories/snack.png';
    case ProductCategory.Candy:
      return 'assets/categories/candy.png';
    default:
      return 'assets/categories/other.png';
  }
}
