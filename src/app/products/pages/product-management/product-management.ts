import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ProductsStore } from '../../store/product.store';
import { ProductList } from '../../components/product-list/product-list';
import { ProductForm } from '../../components/product-form/product-form';
import { ProductFormValue } from '../../../models/product.model';

@Component({
  imports: [
    ProductList,
    MatButtonModule,
    MatIconModule,
  ],
  selector: 'app-product-management',
  styleUrl: './product-management.scss',
  templateUrl: './product-management.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductManagement {
  readonly store = inject(ProductsStore);
  private readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.store.loadProducts();
  }

  openProductDialog(productId?: string): void {
    const product = productId
      ? this.store.products().find((product) => product.id === productId)
      : null;

    if (productId && !product) {
      return;
    }

    const dialogRef = this.dialog.open(ProductForm, {
      width: '500px',
      maxWidth: '90vw',
      data: product,
    });

    dialogRef
      .afterClosed()
      .subscribe((formValue: ProductFormValue | undefined) => {
        if (formValue) {
          this.store.saveProduct(formValue, productId);
        }
      });
  }

  onProductDelete(id: string): void {
    this.store.deleteProduct(id);
  }
}