import { Component, inject, OnInit } from '@angular/core';
import { VendingProductList } from '../../components/vending-product-list/vending-product-list';
import { ProductsStore } from '../../../products/store/product.store';
import { CoinSelector } from '../../components/coin-selector/coin-selector';
import { ACCEPTED_COINS, VendingStore } from '../../store/vending.store';
import { TransactionSummary } from '../../components/transaction-summary/transaction-summary';


@Component({
  imports: [VendingProductList, CoinSelector, TransactionSummary],
  selector: 'app-vending-machine',
  styleUrl: './vending-machine.scss',
  templateUrl: './vending-machine.html',
})
export class VendingMachine implements OnInit {
  readonly productsStore = inject(ProductsStore);
  readonly vendingStore = inject(VendingStore);
  readonly acceptedCoins = ACCEPTED_COINS;

  ngOnInit(): void {
    this.productsStore.loadProducts();
  }

  onCointInserted(coin: number) {
    this.vendingStore.insertCoin(coin);
  }

  onBuyProduct(productId: string) {
    this.vendingStore.buyProduct(productId);
  }
}
