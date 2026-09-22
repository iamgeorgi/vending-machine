import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { Product } from '../../../models/product.model';

@Component({
  imports: [ProductCard],
  selector: 'app-product-list',
  styleUrl: './product-list.scss',
  templateUrl: './product-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductList {
  readonly products = input.required<Product[]>();
  readonly productEdit = output<string>();
  readonly productDelete = output<string>();

  onProductEdit(id: string) {
    this.productEdit.emit(id);
  }

  onProductDelete(id: string) {
    this.productDelete.emit(id);
  }
}
