import { Component, input, output } from '@angular/core';
import { Product } from '../../../models/product.model';
import { VendingProductCard } from '../vending-product-card/vending-product-card';

@Component({
  imports: [VendingProductCard],
  selector: 'app-vending-product-list',
  styleUrl: './vending-product-list.scss',
  templateUrl: './vending-product-list.html',
})
export class VendingProductList {
  readonly products = input.required<Product[]>();
  readonly buyProduct = output<string>();

  onBuyProduct(productId: string) {
    this.buyProduct.emit(productId);
  }
}
