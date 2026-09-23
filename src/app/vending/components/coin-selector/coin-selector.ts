import { CoinFormatterPipe } from '../../../shared/pipes/coin-formatter.pipe';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-coin-selector',
  imports: [MatButtonModule, CoinFormatterPipe],
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

}