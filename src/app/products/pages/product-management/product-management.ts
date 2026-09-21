import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductsStore } from '../../store/product.store';
import { ProductList } from '../../components/product-list/product-list';

@Component({
  imports: [ProductList],
  selector: 'app-product-management',
  styleUrl: './product-management.scss',
  templateUrl: './product-management.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductManagement {
  readonly store = inject(ProductsStore);

  ngOnInit(): void {
    this.store.loadProducts();
  }
}
