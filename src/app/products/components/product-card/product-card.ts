import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { EuroPricePipe } from '../../../shared/pipes/euro-price.pipe';
import { getProductImage } from '../../../shared/helpers';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Product } from '../../../models/product.model';

@Component({
  imports: [EuroPricePipe, MatButtonModule, MatIconModule],
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

  protected readonly getProductImage = getProductImage;
}
