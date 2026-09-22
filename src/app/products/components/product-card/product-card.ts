import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Product, ProductCategory } from '../../../models/product.model';

@Component({
  imports: [CurrencyPipe, MatButtonModule, MatIconModule],
  selector: 'app-product-card',
  styleUrl: './product-card.scss',
  templateUrl: './product-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  readonly product = input.required<Product>();

  readonly delete = output<string>();
  readonly edit = output<string>();

  onEdit(id: string): void {
    this.edit.emit(id);
  }

  onDelete(id: string): void {
    this.delete.emit(id);
  }

  getProductImage(): string {
    return this.product().imageUrl ?? this.getCategoryImage();
  }

  getCategoryImage(): string {
    switch (this.product().category) {
      case ProductCategory.Beverage:
        return 'assets/categories/beverage.webp';

      case ProductCategory.Snack:
        return 'assets/categories/snack.webp';

      case ProductCategory.Candy:
        return 'assets/categories/candy.webp';

      default:
        return 'assets/categories/other.webp';
    }
  }
}
