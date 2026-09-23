import { Component, inject, OnInit } from '@angular/core';
import { VendingProductList } from '../../components/vending-product-list/vending-product-list';
import { ProductsStore } from '../../../products/store/product.store';

@Component({
  imports: [VendingProductList],
  selector: 'app-vending-machine',
  styleUrl: './vending-machine.scss',
  templateUrl: './vending-machine.html',
})
export class VendingMachine implements OnInit {
  readonly productsStore = inject(ProductsStore);

  ngOnInit(): void {
    this.productsStore.loadProducts();
  }
}
