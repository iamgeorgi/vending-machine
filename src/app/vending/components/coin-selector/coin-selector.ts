import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-coin-selector',
  imports: [MatButtonModule],
  templateUrl: './coin-selector.html',
  styleUrl: './coin-selector.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoinSelector {
  readonly coins = input.required<readonly number[]>();

  readonly coinInserted = output<number>();

  onInsertCoin(coin: number): void {
    this.coinInserted.emit(coin);
  }

  formatCoin(coin: number): string {
    return coin >= 100
      ? `€${coin / 100}`
      : `${coin}c`;
  }
}