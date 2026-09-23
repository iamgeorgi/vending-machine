import { Component, input, output } from '@angular/core';
import { Product, ProductCategory } from '../../../models/product.model';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';

@Component({
  imports: [CurrencyPipe, MatButtonModule, MatIconModule],
  selector: 'app-vending-product-card',
  styleUrl: './vending-product-card.scss',
  templateUrl: './vending-product-card.html',
})
export class VendingProductCard {
  readonly product = input.required<Product>();
  readonly buyProduct = output<string>();

  onBuy(id: string) {
    this.buyProduct.emit(id);
  }

  getProductImage(): string {
    return this.product().imageUrl ?? this.getCategoryImage();
  }

  getCategoryImage(): string {
    switch (this.product().category) {
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
}
