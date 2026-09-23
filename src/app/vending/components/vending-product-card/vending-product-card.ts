import { Component, input, output } from '@angular/core';
import { Product } from '../../../models/product.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EuroPricePipe } from '../../../shared/pipes/euro-price.pipe';
import { getProductImage } from '../../../shared/helpers';

@Component({
  imports: [EuroPricePipe, MatButtonModule, MatIconModule],
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

  protected readonly getProductImage = getProductImage;
}
