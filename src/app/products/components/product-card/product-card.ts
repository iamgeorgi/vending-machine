import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Product } from '../../../models/product.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-product-card',
  styleUrl: './product-card.scss',
  templateUrl: './product-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCard {
  readonly product = input.required<Product>();
}
